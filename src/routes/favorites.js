import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/favorites
router.post('/', requireAuth, async (req, res) => {
  const { movieId } = req.body;          // movieId = tmdb_id vindo do front
  const userId = req.user.id_user;       // id_user do token

  try {
    // primeiro garantir que o filme existe na tabela movies
    await db.query(
      'INSERT IGNORE INTO movies (tmdb_id, title) VALUES (?, ?)',
      [movieId, '']
    );

    // depois ligar user <-> movie usando movie_id
    await db.query(
      `INSERT IGNORE INTO favorites (user_id, movie_id)
       SELECT ?, id_movie FROM movies WHERE tmdb_id = ?`,
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
      `SELECT m.tmdb_id
       FROM favorites f
       JOIN movies m ON f.movie_id = m.id_movie
       WHERE f.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter favoritos' });
  }
});

export default router;
