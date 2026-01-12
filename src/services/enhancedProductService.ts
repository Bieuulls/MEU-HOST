import { Database } from 'sqlite';
import { getConnection } from '../lib/db';
import { enhancedImageService } from './enhancedImageService';

interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  sortOrder: number;
  altText?: string;
}

export interface EnhancedProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  status: 'active' | 'draft' | 'archived';
  tenantId: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  categories?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  id: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  options: {
    name: string;
    value: string;
  }[];
  images: ProductImage[];
}

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

export class EnhancedProductService {
  private async validateProduct(data: Partial<EnhancedProduct>): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if ('name' in data) {
      if (!data.name?.trim()) {
        errors.push({ field: 'name', message: 'Name is required' });
      } else if (data.name.length > 255) {
        errors.push({ field: 'name', message: 'Name must be less than 255 characters' });
      }
    }

    if ('price' in data) {
      if (typeof data.price !== 'number' || data.price < 0) {
        errors.push({ field: 'price', message: 'Price must be a positive number' });
      }
    }

    if ('compareAtPrice' in data && data.compareAtPrice !== undefined) {
      if (typeof data.compareAtPrice !== 'number' || data.compareAtPrice < 0) {
        errors.push({ field: 'compareAtPrice', message: 'Compare at price must be a positive number' });
      }
    }

    if ('stock' in data) {
      if (typeof data.stock !== 'number' || data.stock < 0 || !Number.isInteger(data.stock)) {
        errors.push({ field: 'stock', message: 'Stock must be a positive integer' });
      }
    }

    if ('weight' in data && data.weight !== undefined) {
      if (typeof data.weight !== 'number' || data.weight < 0) {
        errors.push({ field: 'weight', message: 'Weight must be a positive number' });
      }
    }

    if ('dimensions' in data && data.dimensions) {
      const { length, width, height } = data.dimensions;
      if (typeof length !== 'number' || length <= 0) {
        errors.push({ field: 'dimensions.length', message: 'Length must be a positive number' });
      }
      if (typeof width !== 'number' || width <= 0) {
        errors.push({ field: 'dimensions.width', message: 'Width must be a positive number' });
      }
      if (typeof height !== 'number' || height <= 0) {
        errors.push({ field: 'dimensions.height', message: 'Height must be a positive number' });
      }
    }

    return errors;
  }

  async createProduct(
    tenantId: string,
    data: Omit<EnhancedProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DatabaseResult<EnhancedProduct>> {
    const validationErrors = await this.validateProduct(data);
    if (validationErrors.length > 0) {
      return { success: false, validationErrors };
    }

    const db = await getConnection(tenantId);
    try {
      await db.run('BEGIN TRANSACTION');

      const now = new Date().toISOString();
      const result = await db.run(
        `INSERT INTO products (
          name, description, price, compare_at_price, stock, sku, barcode,
          weight, dimensions, status, tenant_id, categories, tags, metadata,
          seo, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          data.description,
          data.price,
          data.compareAtPrice,
          data.stock,
          data.sku,
          data.barcode,
          data.weight,
          data.dimensions ? JSON.stringify(data.dimensions) : null,
          data.status,
          tenantId,
          data.categories ? JSON.stringify(data.categories) : null,
          data.tags ? JSON.stringify(data.tags) : null,
          data.metadata ? JSON.stringify(data.metadata) : null,
          data.seo ? JSON.stringify(data.seo) : null,
          now,
          now
        ]
      );

      if (data.images?.length) {
        const imageValues = data.images.map((img, index) => [
          result.lastID,
          img.url,
          img.thumbnailUrl,
          index,
          img.altText || null
        ]);

        await db.run(
          `INSERT INTO product_images (
            product_id, url, thumbnail_url, sort_order, alt_text
          ) VALUES ${imageValues.map(() => '(?, ?, ?, ?, ?)').join(', ')}`,
          imageValues.flat()
        );
      }

      if (data.variants?.length) {
        for (const variant of data.variants) {
          await db.run(
            `INSERT INTO product_variants (
              product_id, sku, barcode, price, compare_at_price, stock, options
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              result.lastID,
              variant.sku,
              variant.barcode,
              variant.price,
              variant.compareAtPrice,
              variant.stock,
              JSON.stringify(variant.options)
            ]
          );

          if (variant.images?.length) {
            const variantImageValues = variant.images.map((img, index) => [
              result.lastID,
              variant.id,
              img.url,
              img.thumbnailUrl,
              index,
              img.altText || null
            ]);

            await db.run(
              `INSERT INTO variant_images (
                product_id, variant_id, url, thumbnail_url, sort_order, alt_text
              ) VALUES ${variantImageValues.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')}`,
              variantImageValues.flat()
            );
          }
        }
      }

      await db.run('COMMIT');

      const createdProduct = await this.getProductById(tenantId, result.lastID!);
      return { success: true, data: createdProduct.data };

    } catch (error) {
      if (db) {
        await db.run('ROLLBACK');
      }
      console.error('Error creating product:', error);
      return { success: false, error: 'Failed to create product' };
    }
  }

  async getProductById(tenantId: string, productId: number): Promise<DatabaseResult<EnhancedProduct>> {
    try {
      const db = await getConnection(tenantId);

      const product = await db.get(
        `SELECT p.*,
          GROUP_CONCAT(DISTINCT pi.url) as image_urls,
          GROUP_CONCAT(DISTINCT pi.thumbnail_url) as thumbnail_urls,
          GROUP_CONCAT(DISTINCT pi.alt_text) as image_alt_texts
         FROM products p
         LEFT JOIN product_images pi ON p.id = pi.product_id
         WHERE p.id = ? AND p.tenant_id = ?
         GROUP BY p.id`,
        [productId, tenantId]
      );

      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      // Transform the product data
      const images = product.image_urls
        ? product.image_urls.split(',').map((url: string, index: number) => ({
            id: `img_${index}`,
            url,
            thumbnailUrl: product.thumbnail_urls.split(',')[index],
            sortOrder: index,
            altText: product.image_alt_texts?.split(',')[index] || undefined
          }))
        : [];

      const enhancedProduct: EnhancedProduct = {
        ...product,
        images,
        dimensions: product.dimensions ? JSON.parse(product.dimensions) : undefined,
        categories: product.categories ? JSON.parse(product.categories) : undefined,
        tags: product.tags ? JSON.parse(product.tags) : undefined,
        metadata: product.metadata ? JSON.parse(product.metadata) : undefined,
        seo: product.seo ? JSON.parse(product.seo) : undefined,
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at)
      };

      return { success: true, data: enhancedProduct };

    } catch (error) {
      console.error('Error fetching product:', error);
      return { success: false, error: 'Failed to fetch product' };
    }
  }

  async updateProductImages(
    tenantId: string,
    productId: number,
    files: File[]
  ): Promise<DatabaseResult<ProductImage[]>> {
    try {
      const uploadResult = await enhancedImageService.uploadImages(files);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }

      const db = await getConnection(tenantId);
      await db.run('BEGIN TRANSACTION');

      const images: ProductImage[] = uploadResult.urls!.map((url, index) => ({
        id: `img_${Date.now()}_${index}`,
        url,
        thumbnailUrl: uploadResult.thumbnails![index],
        sortOrder: index
      }));

      // Insert new images
      const imageValues = images.map(img => [
        productId,
        img.url,
        img.thumbnailUrl,
        img.sortOrder,
        img.altText || null
      ]);

      await db.run(
        `INSERT INTO product_images (
          product_id, url, thumbnail_url, sort_order, alt_text
        ) VALUES ${imageValues.map(() => '(?, ?, ?, ?, ?)').join(', ')}`,
        imageValues.flat()
      );

      await db.run('COMMIT');
      return { success: true, data: images };

    } catch (error) {
      console.error('Error updating product images:', error);
      return { success: false, error: 'Failed to update product images' };
    }
  }
}

export const enhancedProductService = new EnhancedProductService();