import express from 'express';
import db from '../db.js';
import { getMovieDetails } from '../services/tmdb.js';

const router = express.Router();

// POST /api/watchlist - Adicionar à watchlist
router.post('/', async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id_user;

  try {
    const [existing] = await db.query(
      'SELECT id_movie FROM movies WHERE tmdb_id = ? LIMIT 1',
      [movieId]
    );

    let internalMovieId;
    if (existing.length > 0) {
      internalMovieId = existing[0].id_movie;
    } else {
      const movieDetails = await new Promise((resolve, reject) => {
        getMovieDetails(movieId, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });

      const [insertResult] = await db.query(
        `INSERT INTO movies (tmdb_id, title, synopsis, release_year, poster_url, poster_path, duration_minutes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          movieId,
          movieDetails.title || '',
          movieDetails.overview || '',
          movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : null,
          movieDetails.poster_path ? `https://image.tmdb.org/t/p/original${movieDetails.poster_path}` : null,
          movieDetails.poster_path || null,
          movieDetails.runtime || null
        ]
      );
      internalMovieId = insertResult.insertId;
    }

    const [existingWatch] = await db.query(
      'SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [userId, internalMovieId]
    );

    if (existingWatch.length > 0) {
      return res.status(200).json({ message: 'Este filme já está na tua watchlist.' });
    }

    await db.query(
      'INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)',
      [userId, internalMovieId]
    );

    res.status(201).json({ message: 'Adicionado à watchlist' });
  } catch (err) {
    console.error('Erro ao adicionar à watchlist:', err);
    res.status(500).json({ message: 'Erro ao adicionar à watchlist' });
  }
});

// GET /api/watchlist - Listar IDs da watchlist
router.get('/', async (req, res) => {
  const userId = req.user.id_user;

  try {
    const [rows] = await db.query(
      `SELECT m.tmdb_id
       FROM watchlist w
       INNER JOIN movies m ON w.movie_id = m.id_movie
       WHERE w.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao obter watchlist:', err);
    res.status(500).json({ message: 'Erro ao obter watchlist' });
  }
});


// GET /api/watchlist/full
router.get('/full', async (req, res) => {
  const userId = req.user.id_user;

  try {
    const [watchlist] = await db.query(
      `SELECT 
        w.user_id,
        w.movie_id,
        w.created_at as added_at,
        m.title,
        m.synopsis,
        m.release_year,
        m.poster_url,
        m.poster_path,
        m.tmdb_id,
        m.duration_minutes,
        m.vote_average
      FROM watchlist w
      INNER JOIN movies m ON w.movie_id = m.id_movie
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC`,
      [userId]
    );

    const formattedWatchlist = watchlist.map(item => ({
      id: item.tmdb_id,
      title: item.title,
      overview: item.synopsis,
      poster_path: item.poster_path,
      release_date: item.release_year ? `${item.release_year}-01-01` : null,
      runtime: item.duration_minutes,
      vote_average: item.vote_average,  // ← ADICIONAR
      added_at: item.added_at
    }));

    res.json(formattedWatchlist);
  } catch (err) {
    console.error('Erro ao obter watchlist completa:', err);
    res.status(500).json({ message: 'Erro ao obter watchlist completa' });
  }
});


// DELETE /api/watchlist/:movieId - Remover da watchlist
router.delete('/:movieId', async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id_user;

  try {
    const [movie] = await db.query(
      'SELECT id_movie FROM movies WHERE tmdb_id = ? LIMIT 1',
      [movieId]
    );

    if (movie.length === 0) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    const [result] = await db.query(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [userId, movie[0].id_movie]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item não encontrado na watchlist' });
    }

    res.json({ message: 'Removido da watchlist' });
  } catch (err) {
    console.error('Erro ao remover da watchlist:', err);
    res.status(500).json({ message: 'Erro ao remover da watchlist' });
  }
});

export default router;
