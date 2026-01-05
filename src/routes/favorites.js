import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/favorites
router.post('/', requireAuth, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id_user;

  try {
    await db.query(
      'INSERT IGNORE INTO favorites (id_user, tmdb_id) VALUES (?, ?)',
      [userId, movieId]
    );
    res.status(201).json({ message: 'Adicionado aos favoritos' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar aos favoritos' });
  }
});

// GET /api/favorites
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id_user;

  try {
    const [rows] = await db.query(
      'SELECT tmdb_id FROM favorites WHERE id_user = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter favoritos' });
  }
});

export default router;
