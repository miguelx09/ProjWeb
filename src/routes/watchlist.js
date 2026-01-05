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
      'INSERT IGNORE INTO movies (tmdb_id, title) VALUES (?, ?)',
      [movieId, '']
    );

    await db.query(
      `INSERT IGNORE INTO watchlist (user_id, movie_id)
       SELECT ?, id_movie FROM movies WHERE tmdb_id = ?`,
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
      `SELECT m.tmdb_id
       FROM watchlist w
       JOIN movies m ON w.movie_id = m.id_movie
       WHERE w.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter watchlist' });
  }
});

router.get('/full', requireAuth, async (req, res) => {
  const userId = req.user.id_user;

  try {
    const [rows] = await db.query(
      `SELECT m.tmdb_id
       FROM watchlist w
       JOIN movies m ON w.movie_id = m.id_movie
       WHERE w.user_id = ?`,
      [userId]
    );

    const ids = rows.map(r => r.tmdb_id);

    // buscar detalhes a partir do teu serviço TMDB
    const movies = [];
    for (const id of ids) {
      const movie = await tmdb.getMovieDetails(id); // adapta ao teu serviço
      movies.push(movie);
    }

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter watchlist completa' });
  }
});


export default router;
