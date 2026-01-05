import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/watchlist
router.post('/', requireAuth, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id_user;

  try {
    await db.query(
      'INSERT IGNORE INTO watchlist (id_user, tmdb_id) VALUES (?, ?)',
      [userId, movieId]
    );
    res.status(201).json({ message: 'Adicionado à watchlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar à watchlist' });
  }
});

// GET /api/watchlist
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id_user;

  try {
    const [rows] = await db.query(
      'SELECT tmdb_id FROM watchlist WHERE id_user = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter watchlist' });
  }
});

export default router;
