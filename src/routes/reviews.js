import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews/movie/:movieId - Listar reviews de um filme
router.get('/reviews/movie/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT r.*, u.username 
       FROM reviews r
       JOIN users u ON r.user_id = u.id_user
       JOIN movies m ON r.movie_id = m.id_movie
       WHERE m.tmdb_id = ?
       ORDER BY r.created_at DESC`,
      [movieId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter reviews' });
  }
});

// POST /api/reviews - Criar/atualizar review
router.post('/reviews', requireAuth, async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const userId = req.user.id_user;

  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({ message: 'Rating deve estar entre 1 e 10' });
  }

  try {
    // Garantir que o filme existe
    const [existing] = await db.query(
      'SELECT id_movie FROM movies WHERE tmdb_id = ? LIMIT 1',
      [movieId]
    );

    let internalMovieId;
    if (existing.length > 0) {
      internalMovieId = existing[0].id_movie;
    } else {
      const [insertResult] = await db.query(
        'INSERT INTO movies (tmdb_id, title) VALUES (?, ?)',
        [movieId, '']
      );
      internalMovieId = insertResult.insertId;
    }

    // Verificar se já existe review deste user para este filme
    const [existingReview] = await db.query(
      'SELECT id_review FROM reviews WHERE user_id = ? AND movie_id = ?',
      [userId, internalMovieId]
    );

    if (existingReview.length > 0) {
      // Atualizar review existente
      await db.query(
        `UPDATE reviews 
         SET rating = ?, comment = ?, review_date = CURDATE()
         WHERE id_review = ?`,
        [rating, comment || '', existingReview[0].id_review]
      );
      res.json({ message: 'Review atualizado' });
    } else {
      // Criar novo review
      await db.query(
        `INSERT INTO reviews (user_id, movie_id, rating, comment, review_date)
         VALUES (?, ?, ?, ?, CURDATE())`,
        [userId, internalMovieId, rating, comment || '']
      );
      res.status(201).json({ message: 'Review criado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar/atualizar review' });
  }
});

// DELETE /api/reviews/:reviewId - Apagar review
router.delete('/reviews/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id_user;

  try {
    const [result] = await db.query(
      'DELETE FROM reviews WHERE id_review = ? AND user_id = ?',
      [reviewId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review não encontrado ou não tens permissão' });
    }

    res.json({ message: 'Review apagado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao apagar review' });
  }
});

// POST /api/reviews/:reviewId/vote - Votar útil/não útil
router.post('/reviews/:reviewId/vote', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { helpful } = req.body; // true = útil, false = não útil

  try {
    if (helpful) {
      await db.query(
        'UPDATE reviews SET useful_votes = useful_votes + 1 WHERE id_review = ?',
        [reviewId]
      );
    } else {
      await db.query(
        'UPDATE reviews SET useful_votes = useful_votes - 1 WHERE id_review = ?',
        [reviewId]
      );
    }
    res.json({ message: 'Voto registado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao votar' });
  }
});

export default router;
