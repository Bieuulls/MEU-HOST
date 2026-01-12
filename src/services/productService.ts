import { getConnection, releaseConnection } from '../lib/db';

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  status?: 'active' | 'draft';
  is_featured?: boolean;
  tenantId: string;
  image_url?: string;
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  status?: 'active' | 'draft';
  is_featured?: boolean;
  image_url?: string;
}

export type Product = {
  id: number;
  tenant_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  barcode: string | null;
  weight: number | null;
  status: 'active' | 'draft';
  is_featured: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export const productService = {
  async createProduct(data: ProductInput): Promise<Product> {
    const db = await getConnection(data.tenantId);
    try {
      // Validate required fields
      if (!data.name) throw new Error('Product name is required');
      if (data.price === undefined || data.price < 0) throw new Error('Valid price is required');
      if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0 || !Number.isInteger(data.stock))) {
        throw new Error('Stock must be a non-negative integer');
      }
      if (data.weight !== undefined && (typeof data.weight !== 'number' || data.weight < 0)) {
        throw new Error('Weight must be a non-negative number');
      }

      const result = await db.run(
        `INSERT INTO products (
          tenant_id, name, description, price, stock, sku, barcode, weight, status, is_featured, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.tenantId,
          data.name,
          data.description || null,
          data.price,
          data.stock || 0,
          data.sku || null,
          data.barcode || null,
          data.weight || null,
          data.status || 'active',
          data.is_featured ? 1 : 0,
          data.image_url || null
        ]
      );

      const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', result.lastID);
      if (!product) throw new Error('Failed to create product');

      return product;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error creating product:', error);
      throw new Error(`Failed to create product: ${errorMessage}`);
    } finally {
      await releaseConnection(db);
    }
  },

  async getProducts(tenantId: string): Promise<Product[]> {
    const db = await getConnection(tenantId);
    try {
      return await db.all<Product[]>('SELECT * FROM products WHERE tenant_id = ? ORDER BY created_at DESC', tenantId);
    } catch (error: unknown) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    } finally {
      await releaseConnection(db);
    }
  },

  async getProduct(tenantId: string, id: number): Promise<Product | undefined> {
    const db = await getConnection(tenantId);
    try {
      return await db.get<Product>('SELECT * FROM products WHERE id = ? AND tenant_id = ?', [id, tenantId]);
    } catch (error: unknown) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    } finally {
      await releaseConnection(db);
    }
  },

  async updateProduct(tenantId: string, id: number, data: ProductUpdateInput): Promise<Product | undefined> {
    const db = await getConnection(tenantId);
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.name !== undefined) {
        updates.push('name = ?');
        values.push(data.name);
      }
      if (data.description !== undefined) {
        updates.push('description = ?');
        values.push(data.description);
      }
      if (data.price !== undefined) {
        if (data.price < 0) throw new Error('Price must be non-negative');
        updates.push('price = ?');
        values.push(data.price);
      }
      if (data.stock !== undefined) {
        if (data.stock < 0 || !Number.isInteger(data.stock)) throw new Error('Stock must be a non-negative integer');
        updates.push('stock = ?');
        values.push(data.stock);
      }
      if (data.sku !== undefined) {
        updates.push('sku = ?');
        values.push(data.sku);
      }
      if (data.barcode !== undefined) {
        updates.push('barcode = ?');
        values.push(data.barcode);
      }
      if (data.weight !== undefined) {
        if (data.weight < 0) throw new Error('Weight must be non-negative');
        updates.push('weight = ?');
        values.push(data.weight);
      }
      if (data.status !== undefined) {
        updates.push('status = ?');
        values.push(data.status);
      }
      if (data.is_featured !== undefined) {
        updates.push('is_featured = ?');
        values.push(data.is_featured ? 1 : 0);
      }
      if (data.image_url !== undefined) {
        updates.push('image_url = ?');
        values.push(data.image_url);
      }

      if (updates.length === 0) return await this.getProduct(tenantId, id);

      updates.push('updated_at = CURRENT_TIMESTAMP');

      await db.run(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ? AND tenant_id = ?`,
        [...values, id, tenantId]
      );

      return await this.getProduct(tenantId, id);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error updating product:', error);
      throw new Error(`Failed to update product: ${errorMessage}`);
    } finally {
      await releaseConnection(db);
    }
  },

  async deleteProduct(tenantId: string, id: number): Promise<boolean> {
    const db = await getConnection(tenantId);
    try {
      const result = await db.run('DELETE FROM products WHERE id = ? AND tenant_id = ?', [id, tenantId]);
      return (result.changes || 0) > 0;
    } catch (error: unknown) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    } finally {
      await releaseConnection(db);
    }
  }
};
