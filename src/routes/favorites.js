import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// GET /api/favorites -> lista favoritos do utilizador autenticado
router.get('/', authMiddleware, async (req, res) => {
  const { id_user } = req.user;

  try {
    const [rows] = await db.query(
      `SELECT m.*
       FROM favorites f
       JOIN movies m ON m.id_movie = f.movie_id
       WHERE f.user_id = ?`,
      [id_user]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter favoritos' });
  }
});


// POST /api/favorites/:id_movie
router.post('/:id_movie', authMiddleware, async (req, res) => {
  const { id_movie } = req.params;
  const { id_user } = req.user;

  try {
    await db.query(
      'INSERT IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)',
      [id_user, id_movie]
    );
    res.status(201).json({ message: 'Favorito adicionado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar favorito' });
  }
});

export default router;
