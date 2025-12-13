import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/movies/:id_movie/reviews
 * Cria uma review para um filme (user autenticado)
 */
router.post('/movies/:id_movie/reviews', authMiddleware, async (req, res) => {
  const { id_movie } = req.params;
  const { rating, comment } = req.body;
  const { id_user } = req.user;

  if (!rating) {
    return res.status(400).json({ message: 'Rating é obrigatório' });
  }

  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    await db.query(
      `INSERT INTO reviews (user_id, movie_id, review_date, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [id_user, id_movie, today, rating, comment || null]
    );

    res.status(201).json({ message: 'Review criada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar review' });
  }
});

/**
 * GET /api/movies/:id_movie/reviews
 * Lista reviews de um filme
 */
router.get('/movies/:id_movie/reviews', async (req, res) => {
  const { id_movie } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT r.id_review,
              r.rating,
              r.comment,
              r.review_date,
              r.useful_votes,
              u.username
       FROM reviews r
       JOIN users u ON u.id_user = r.user_id
       WHERE r.movie_id = ?
       ORDER BY r.review_date DESC`,
      [id_movie]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter reviews' });
  }
});

/**
 * (Opcional) POST /api/reviews/:id_review/useful
 * Incrementa contador de "útil" numa review
 */
router.post('/reviews/:id_review/useful', authMiddleware, async (req, res) => {
  const { id_review } = req.params;

  try {
    await db.query(
      'UPDATE reviews SET useful_votes = useful_votes + 1 WHERE id_review = ?',
      [id_review]
    );
    res.json({ message: 'Voto de utilidade registado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao votar review' });
  }
});

export default router;
