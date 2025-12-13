import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/watchlist/:id_movie -> adicionar à watchlist
router.post('/:id_movie', authMiddleware, async (req, res) => {
  const { id_movie } = req.params;
  const { id_user } = req.user;

  try {
    await db.query(
      'INSERT IGNORE INTO watchlist (user_id, movie_id) VALUES (?, ?)',
      [id_user, id_movie]
    );
    res.status(201).json({ message: 'Adicionado à watchlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar à watchlist' });
  }
});

// GET /api/watchlist -> listar watchlist do utilizador autenticado
router.get('/', authMiddleware, async (req, res) => {
  const { id_user } = req.user;

  try {
    const [rows] = await db.query(
      `SELECT m.*
       FROM watchlist w
       JOIN movies m ON m.id_movie = w.movie_id
       WHERE w.user_id = ?`,
      [id_user]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter watchlist' });
  }
});

export default router;
