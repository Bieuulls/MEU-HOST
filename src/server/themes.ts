import express from 'express';
import { getConnection } from '../lib/db';

const router = express.Router();

// Get theme by tenant ID
router.get('/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const db = await getConnection(tenantId);
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

    res.json(JSON.parse(theme.settings as string));
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
    const db = await getConnection(tenantId);

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

export default router;