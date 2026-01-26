import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConnection, releaseConnection } from '../../lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
  try {
    const { tenant_id } = req.query;
    if (!tenant_id) {
      return res.status(400).json({ error: 'tenant_id is required' });
    }
    const products = await req.app.locals.db.all('SELECT * FROM products WHERE tenant_id = ?', [tenant_id]);
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, tenant_id, is_featured, sku, barcode, weight, status } = req.body;
    if (!tenant_id) {
      return res.status(400).json({ error: 'tenant_id is required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // Validate numeric fields
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }

    const db = await getConnection(tenant_id);
    try {
      const result = await db.run(
        `INSERT INTO products (
          name, description, price, stock, tenant_id, is_featured,
          sku, barcode, weight, status, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name.trim(),
          description?.trim() || '',
          price,
          stock || 0,
          tenant_id,
          is_featured ? 1 : 0,
          sku?.trim() || null,
          barcode?.trim() || null,
          weight || null,
          status || 'active',
          imageUrl
        ]
      );

      const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
      await releaseConnection(db);
      res.status(201).json(newProduct);
    } catch (dbError) {
      await releaseConnection(db);
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, is_featured, status } = req.body;

    await req.app.locals.db.run(
      `UPDATE products SET
        name = ?,
        description = ?,
        price = ?,
        stock = ?,
        is_featured = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        name,
        description,
        price,
        stock,
        is_featured ? 1 : 0,
        status || 'active',
        id
      ]
    );

    const updatedProduct = await req.app.locals.db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.app.locals.db.run('DELETE FROM products WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await req.app.locals.db.all('SELECT * FROM products WHERE is_featured = 1');
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error getting featured products:', error);
    res.status(500).json({ error: 'Failed to get featured products' });
  }
});

export default router;