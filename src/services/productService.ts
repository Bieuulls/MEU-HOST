import { getConnection, DatabaseError } from '../lib/db';
import { Database } from 'sqlite';

type ValidationError = {
  field: string;
  message: string;
};

type DatabaseResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: ValidationError[];
};

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  status: 'active' | 'draft';
  tenantId: string;
}

export interface ProductCreateInput extends Omit<Product, 'id'> {}
export interface ProductUpdateInput extends Partial<Omit<Product, 'id' | 'tenantId'>> {}

export class ProductServiceError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
    public validationErrors?: ValidationError[]
  ) {
    super(message);
    this.name = 'ProductServiceError';
  }
}

const validateProduct = (data: Partial<Product>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if ('name' in data && (!data.name || data.name.trim().length === 0)) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if ('price' in data && (typeof data.price !== 'number' || data.price < 0)) {
    errors.push({ field: 'price', message: 'Price must be a positive number' });
  }

  if ('stock' in data && (typeof data.stock !== 'number' || data.stock < 0 || !Number.isInteger(data.stock))) {
    errors.push({ field: 'stock', message: 'Stock must be a positive integer' });
  }

  if ('weight' in data && data.weight !== undefined && (typeof data.weight !== 'number' || data.weight < 0)) {
    errors.push({ field: 'weight', message: 'Weight must be a positive number' });
  }

  return errors;
};

const handleDatabaseError = (error: unknown, operation: string): never => {
  console.error(`Database error during ${operation}:`, error);

  if (error instanceof Error && 'code' in error) {
    const dbError = error as DatabaseError;
    if (dbError.code === 'SQLITE_CONSTRAINT') {
      throw new ProductServiceError(`Unique constraint violation during ${operation}`, error);
    }
    if (dbError.code === 'SQLITE_BUSY') {
      throw new ProductServiceError(`Database is busy, please try again later`, error);
    }
  }

  throw new ProductServiceError(`Failed to ${operation}`, error);
};

const withDatabase = async <T>(
  tenantId: string,
  operation: (db: Database) => Promise<T>,
  useTransaction = false
): Promise<T> => {
  let db: Database | undefined;
  try {
    db = await getConnection(tenantId);

    if (useTransaction) {
      await db.run('BEGIN TRANSACTION');
    }

    const result = await operation(db);

    if (useTransaction) {
      await db.run('COMMIT');
    }

    return result;
  } catch (error) {
    if (useTransaction && db) {
      try {
        await db.run('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error during transaction rollback:', rollbackError);
      }
    }
    throw new ProductServiceError('Database operation failed', error);
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
};

export const productService = {
  getProducts: async (tenantId: string): Promise<Product[]> => {
    try {
      return await withDatabase(tenantId, async (db) => {
        const products = await db.all<Product[]>(
          'SELECT * FROM products WHERE tenant_id = ?',
          [tenantId]
        );
        return products;
      });
    } catch (error) {
      handleDatabaseError(error, 'fetch products');
    }
  },

  getProductById: async (productId: string, tenantId: string): Promise<Product | null> => {
    try {
      return await withDatabase(tenantId, async (db) => {
        const product = await db.get<Product>(
          'SELECT * FROM products WHERE id = ? AND tenant_id = ?',
          [productId, tenantId]
        );
        return product || null;
      });
    } catch (error) {
      handleDatabaseError(error, 'fetch product');
    }
  },

  createProduct: async (productData: ProductCreateInput): Promise<DatabaseResult<void>> => {
    const validationErrors = validateProduct(productData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        validationErrors,
        error: 'Validation failed'
      };
    }

    try {
      await withDatabase(productData.tenantId, async (db) => {
        await db.run(
          `INSERT INTO products (
            name, description, price, stock, sku, barcode, weight, status, tenant_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productData.name.trim(),
            productData.description?.trim() || '',
            productData.price,
            productData.stock,
            productData.sku?.trim() || null,
            productData.barcode?.trim() || null,
            productData.weight || null,
            productData.status,
            productData.tenantId,
          ]
        );
      }, true);

      return { success: true };
    } catch (error) {
      if (error instanceof ProductServiceError) {
        return {
          success: false,
          error: error.message
        };
      }
      handleDatabaseError(error, 'create product');
      return {
        success: false,
        error: 'Unknown error occurred'
      };
    }
  },

  updateProduct: async (productId: string, productData: ProductUpdateInput, tenantId: string): Promise<DatabaseResult<void>> => {
    const validationErrors = validateProduct(productData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        validationErrors,
        error: 'Validation failed'
      };
    }

    try {
      await withDatabase(tenantId, async (db) => {
        // First check if the product exists
        const existingProduct = await db.get('SELECT id FROM products WHERE id = ? AND tenant_id = ?', [productId, tenantId]);
        if (!existingProduct) {
          throw new ProductServiceError('Product not found');
        }

        const updates = Object.entries(productData)
          .filter(([_, value]) => value !== undefined)
          .map(([key, _]) => `${key} = ?`)
          .join(', ');

        if (!updates) return;

        const values = Object.entries(productData)
          .filter(([_, value]) => value !== undefined)
          .map(([_, value]) => {
            if (typeof value === 'string') return value.trim();
            return value;
          });

        await db.run(
          `UPDATE products SET ${updates} WHERE id = ? AND tenant_id = ?`,
          [...values, productId, tenantId]
        );
      }, true);

      return { success: true };
    } catch (error) {
      if (error instanceof ProductServiceError) {
        return {
          success: false,
          error: error.message
        };
      }
      handleDatabaseError(error, 'update product');
      return {
        success: false,
        error: 'Unknown error occurred'
      };
    }
  },

  deleteProduct: async (productId: string, tenantId: string): Promise<void> => {
    try {
      await withDatabase(tenantId, async (db) => {
        await db.run('DELETE FROM products WHERE id = ? AND tenant_id = ?', [productId, tenantId]);
      });
    } catch (error) {
      handleDatabaseError(error, 'delete product');
    }
  },
};
