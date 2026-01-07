// src/routes/watchlist.js
import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { getMovieDetails } from '../services/tmdb.js';

const router = express.Router();

// POST /api/watchlist
router.post('/', requireAuth, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id_user;

  try {
    // 1. verificar se o filme já existe
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

    // 2. tentar adicionar à watchlist
    const [insertWatch] = await db.query(
      'INSERT IGNORE INTO watchlist (user_id, movie_id) VALUES (?, ?)',
      [userId, internalMovieId]
    );

    if (insertWatch.affectedRows === 0) {
      return res.status(200).json({ message: 'Este filme já está na tua watchlist.' });
    }

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

// GET /api/watchlist/full
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
    const movies = [];

    for (const id of ids) {
      const movie = await new Promise((resolve, reject) => {
        getMovieDetails(id, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
      movies.push(movie);
    }

    res.json(movies);
  } catch (err) {
    console.error('ERRO /api/watchlist/full:', err);
    res.status(500).json({ message: 'Erro ao obter watchlist completa' });
  }
});

// DELETE /api/watchlist/:movieId
router.delete('/:movieId', requireAuth, async (req, res) => {
  const { movieId } = req.params; // tmdb_id
  const userId = req.user.id_user;

  try {
    await db.query(
      `DELETE FROM watchlist 
       WHERE user_id = ? 
       AND movie_id = (SELECT id_movie FROM movies WHERE tmdb_id = ? LIMIT 1)`,
      [userId, movieId]
    );
    res.json({ message: 'Removido da watchlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover da watchlist' });
  }
});


export default router;
