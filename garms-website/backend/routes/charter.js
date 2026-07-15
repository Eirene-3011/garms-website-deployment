const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM citizens_charter LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/', authenticateAdmin, upload.single('pdf'), async (req, res) => {
  const { body_richtext } = req.body;
  const pdf_file_url = req.file ? req.file.path : undefined;
  try {
    const [existing] = await db.query('SELECT id FROM citizens_charter LIMIT 1');
    if (existing.length) {
      const sets = ['body_richtext=?'];
      const vals = [body_richtext];
      if (pdf_file_url) { sets.push('pdf_file_url=?'); vals.push(pdf_file_url); }
      vals.push(existing[0].id);
      await db.query(`UPDATE citizens_charter SET ${sets.join(',')} WHERE id=?`, vals);
    } else {
      await db.query('INSERT INTO citizens_charter (body_richtext, pdf_file_url) VALUES (?, ?)', [body_richtext, pdf_file_url]);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
