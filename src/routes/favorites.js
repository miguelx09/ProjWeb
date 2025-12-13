// src/routes/favorites.js
import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Adicionar filme aos favoritos do utilizador autenticado
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
