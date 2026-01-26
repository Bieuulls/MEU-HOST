import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

// Initialize database connection
async function initializeDb() {
  try {
    db = await open({
      filename: 'database.sqlite',
      driver: sqlite3.Database
    });
    console.log('Database connection established successfully');
    await initializeThemesTable();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize database when module is loaded
initializeDb();

const router = express.Router();

// Initialize themes table
async function initializeThemesTable() {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS themes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        settings JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_themes_tenant_id ON themes(tenant_id);
    `);
    console.log('Themes table initialized successfully');
  } catch (error) {
    console.error('Error initializing themes table:', error);
    throw error;
  }
}

// Get theme by tenant ID
router.get('/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const theme = await db.get('SELECT * FROM themes WHERE tenant_id = ?', [tenantId]);

    if (!theme) {
      // Return default theme settings if no theme exists
      return res.json({
        colors: {
          primary: '#404040',
          secondary: '#666666',
          accent: '#4F46E5'
        },
        typography: {
          headingFont: 'Inter',
          bodyFont: 'Inter'
        },
        layout: {
          containerWidth: 'max-w-7xl',
          spacing: 'space-y-8'
        }
      });
    }

    res.json(JSON.parse(theme.settings));
  } catch (error) {
    console.error('Error getting theme:', error);
    res.status(500).json({ error: 'Failed to get theme' });
  }
});

// Update theme
router.put('/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const settings = req.body;

    await db.run(
      `INSERT OR REPLACE INTO themes (tenant_id, settings) VALUES (?, ?)`,
      [tenantId, JSON.stringify(settings)]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

// Table initialization is now handled in initializeDb()

export default router;