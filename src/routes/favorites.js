import express from 'express';
import db from '../db.js';
import { getMovieDetails } from '../services/tmdb.js';

const router = express.Router();

// Nota: authenticateToken já é aplicado no app.js, então não precisa do requireAuth aqui

// POST /api/favorites - Adicionar aos favoritos
router.post('/', async (req, res) => {
  const { movieId } = req.body; // tmdb_id
  const userId = req.user.id_user;

  try {
    // 1. Verificar se o filme já existe na tabela movies
    const [existing] = await db.query(
      'SELECT id_movie FROM movies WHERE tmdb_id = ? LIMIT 1',
      [movieId]
    );

    let internalMovieId;
    if (existing.length > 0) {
      internalMovieId = existing[0].id_movie;
    } else {
      // Buscar detalhes do filme no TMDB para inserir completo
      const movieDetails = await new Promise((resolve, reject) => {
        getMovieDetails(movieId, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });

      // Inserir filme completo na base de dados
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

    // 2. Verificar se já existe nos favoritos
    const [existingFav] = await db.query(
      'SELECT * FROM favorites WHERE id_user = ? AND id_movie = ?',
      [userId, internalMovieId]
    );

    if (existingFav.length > 0) {
      return res.status(200).json({ message: 'Este filme já está nos teus favoritos.' });
    }

    // 3. Adicionar aos favoritos
    await db.query(
      'INSERT INTO favorites (id_user, id_movie) VALUES (?, ?)',
      [userId, internalMovieId]
    );

    res.status(201).json({ message: 'Adicionado aos favoritos' });
  } catch (err) {
    console.error('Erro ao adicionar aos favoritos:', err);
    res.status(500).json({ message: 'Erro ao adicionar aos favoritos' });
  }
});

// GET /api/favorites - Listar IDs dos favoritos (para verificar se está favoritado)
router.get('/', async (req, res) => {
  const userId = req.user.id_user;

  try {
    const [rows] = await db.query(
      `SELECT m.tmdb_id
       FROM favorites f
       INNER JOIN movies m ON f.id_movie = m.id_movie
       WHERE f.id_user = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao obter favoritos:', err);
    res.status(500).json({ message: 'Erro ao obter favoritos' });
  }
});

// GET /api/favorites/full - Listar favoritos COM TODOS OS DETALHES
router.get('/full', async (req, res) => {
  const userId = req.user.id_user;

  try {
    const [favorites] = await db.query(
      `SELECT 
        f.id_favorite,
        f.id_user,
        f.id_movie,
        f.added_at,
        m.title,
        m.synopsis,
        m.release_year,
        m.poster_url,
        m.poster_path,
        m.tmdb_id,
        m.duration_minutes
      FROM favorites f
      INNER JOIN movies m ON f.id_movie = m.id_movie
      WHERE f.id_user = ?
      ORDER BY f.added_at DESC`,
      [userId]
    );

    // Formatar para compatibilidade com frontend
    const formattedFavorites = favorites.map(fav => ({
      id: fav.tmdb_id,
      title: fav.title,
      overview: fav.synopsis,
      poster_path: fav.poster_path,
      release_date: fav.release_year ? `${fav.release_year}-01-01` : null,
      runtime: fav.duration_minutes,
      added_at: fav.added_at
    }));

    res.json(formattedFavorites);
  } catch (err) {
    console.error('Erro ao obter favoritos detalhados:', err);
    res.status(500).json({ message: 'Erro ao obter favoritos detalhados' });
  }
});

// DELETE /api/favorites/:movieId - Remover dos favoritos
router.delete('/:movieId', async (req, res) => {
  const { movieId } = req.params; // tmdb_id
  const userId = req.user.id_user;

  try {
    // Buscar id_movie baseado no tmdb_id
    const [movie] = await db.query(
      'SELECT id_movie FROM movies WHERE tmdb_id = ? LIMIT 1',
      [movieId]
    );

    if (movie.length === 0) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    // Remover dos favoritos
    const [result] = await db.query(
      'DELETE FROM favorites WHERE id_user = ? AND id_movie = ?',
      [userId, movie[0].id_movie]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorito não encontrado' });
    }

    res.json({ message: 'Removido dos favoritos' });
  } catch (err) {
    console.error('Erro ao remover dos favoritos:', err);
    res.status(500).json({ message: 'Erro ao remover dos favoritos' });
  }
});

export default router;
