import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import themesRouter from './src/server/themes.js';
import productRoutes from './src/server/routes/products.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5177'],
  credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/themes', themesRouter);
app.use('/products', productRoutes);

// Database
let db;

// Initialize database and start server
async function initializeDatabase() {
  try {
    db = await open({
      filename: 'database.sqlite',
      driver: sqlite3.Database
    });

    // Drop existing tables to ensure clean schema
    await db.exec('DROP TABLE IF EXISTS products');

    // Create tables with proper schema
    await db.exec(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        sku TEXT,
        barcode TEXT,
        weight REAL,
        status TEXT DEFAULT 'active',
        is_featured INTEGER DEFAULT 0,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    `);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Products routes
app.get('/products', async (req, res) => {
  try {
    const { tenant_id } = req.query;
    if (!tenant_id) {
      return res.status(400).json({ error: 'tenant_id is required' });
    }
    const products = await db.all('SELECT * FROM products WHERE tenant_id = ?', [tenant_id]);
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

app.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, tenant_id, is_featured, sku, barcode, weight, status } = req.body;
    if (!tenant_id) {
      return res.status(400).json({ error: 'tenant_id is required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await db.run(
      `INSERT INTO products (
        name, description, price, stock, tenant_id, is_featured,
        sku, barcode, weight, status, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        price,
        stock,
        tenant_id,
        is_featured ? 1 : 0,
        sku || null,
        barcode || null,
        weight || null,
        status || 'active',
        imageUrl
      ]
    );

    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, is_featured, status } = req.body;

    await db.run(
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

    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM products WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/products/featured', async (req, res) => {
  try {
    const featuredProducts = await db.all('SELECT * FROM products WHERE is_featured = 1');
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error getting featured products:', error);
    res.status(500).json({ error: 'Failed to get featured products' });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.locals.db = db;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();