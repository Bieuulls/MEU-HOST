import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getConnection } from '../../lib/db';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'public/uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  }
});

// Create product with multiple images
router.post('/', upload.array('images', 5), async (req, res) => {
  const db = await getConnection(req.body.tenant_id);

  try {
    await db.run('BEGIN TRANSACTION');

    const files = req.files as Express.Multer.File[];
    const imageUrls = files.map(file => `/uploads/${file.filename}`);

    const result = await db.run(
      `INSERT INTO products (
        name, description, price, stock, sku, status, tenant_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        req.body.name,
        req.body.description,
        parseFloat(req.body.price),
        parseInt(req.body.stock),
        req.body.sku,
        req.body.status,
        req.body.tenant_id
      ]
    );

    const productId = result.lastID;

    // Insert image records
    for (let i = 0; i < imageUrls.length; i++) {
      await db.run(
        `INSERT INTO product_images (
          product_id, url, sort_order, created_at
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [productId, imageUrls[i], i]
      );
    }

    await db.run('COMMIT');

    const product = await db.get(
      `SELECT p.*, GROUP_CONCAT(pi.url) as image_urls
       FROM products p
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [productId]
    );

    res.status(201).json(product);
  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get all products with images
router.get('/', async (req, res) => {
  const db = await getConnection(req.query.tenant_id as string);

  try {
    const products = await db.all(
      `SELECT p.*, GROUP_CONCAT(pi.url) as image_urls
       FROM products p
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE p.tenant_id = ?
       GROUP BY p.id`,
      [req.query.tenant_id]
    );

    res.json(products.map(product => ({
      ...product,
      image_urls: product.image_urls ? product.image_urls.split(',') : []
    })));
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

export default router;