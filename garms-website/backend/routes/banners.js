const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: active banners only
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM banner_images WHERE is_active = 1 ORDER BY sort_order');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: all banners
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM banner_images ORDER BY sort_order');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  const { caption, sort_order, observance_tag, observance_label } = req.body;
  const image_url = req.file ? req.file.path : req.body.image_url;
  try {
    const [result] = await db.query(
      'INSERT INTO banner_images (image_url, caption, sort_order, is_active, observance_tag, observance_label) VALUES (?, ?, ?, 1, ?, ?)',
      [image_url, caption, sort_order || 0, observance_tag || null, observance_label || null]
    );
    res.status(201).json({ id: result.insertId, image_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  const { caption, sort_order, is_active, observance_tag, observance_label } = req.body;
  const image_url = req.file ? req.file.path : req.body.image_url;
  try {
    await db.query(
      'UPDATE banner_images SET image_url = COALESCE(?, image_url), caption = ?, sort_order = ?, is_active = ?, observance_tag = ?, observance_label = ? WHERE id = ?',
      [image_url, caption, sort_order, is_active, observance_tag || null, observance_label || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM banner_images WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
