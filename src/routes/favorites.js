// src/routes/favorites.js
import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import tmdb from '../services/tmdb.js'; // adapta ao que tens

const router = express.Router();

// POST /api/favorites
router.post('/', requireAuth, async (req, res) => {
  const { movieId } = req.body;        // ID do TMDB recebido do front
  const userId = req.user.id_user;

  try {
    // garantir que o filme existe na tabela movies
    await db.query(
      'INSERT IGNORE INTO movies (tmdb_id, title) VALUES (?, ?)',
      [movieId, '']
    );

    // ligar user -> movie (via movie_id)
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

// GET /api/favorites  (só ids TMDB, se precisares)
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

// GET /api/favorites/full  -> filmes com detalhes TMDB
router.get('/full', requireAuth, async (req, res) => {
  const userId = req.user.id_user;

  try {
    const [rows] = await db.query(
      `SELECT m.tmdb_id
       FROM favorites f
       JOIN movies m ON f.movie_id = m.id_movie
       WHERE f.user_id = ?`,
      [userId]
    );

    const ids = rows.map(r => r.tmdb_id);
    const movies = [];

    // exemplo com serviço TMDB em estilo callback:
    for (const id of ids) {
      const movie = await new Promise((resolve, reject) => {
        tmdb.movie.info(id, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
      movies.push(movie);
    }

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter favoritos detalhados' });
  }
});

export default router;
