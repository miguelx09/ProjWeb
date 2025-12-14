import express from 'express';
import { searchMovies, getMovieDetails } from '../services/tmdb.js';
import pool from '../db.js'; // ajusta o caminho se for diferente

const router = express.Router();

// GET /api/tmdb/search?query=matrix
router.get('/tmdb/search', (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query é obrigatória' });
  }

  searchMovies(query, (err, result) => {
    if (err) {
      console.error('TMDB search error:', err);
      return res.status(500).json({ message: 'Erro ao pesquisar na TMDB', error: err });
    }
    res.json(result);
  });
});

// GET /api/tmdb/movie/603
router.get('/tmdb/movie/:id', (req, res) => {
  const { id } = req.params;

  getMovieDetails(id, (err, result) => {
    if (err) {
      console.error('TMDB movie error:', err);
      return res.status(500).json({ message: 'Erro ao obter detalhes na TMDB', error: err });
    }
    res.json(result);
  });
});

// POST /api/tmdb/import/603  -> importa filme para a BD
router.post('/tmdb/import/:id', (req, res) => {
  const { id } = req.params;

  getMovieDetails(id, async (err, movie) => {
    if (err) {
      console.error('TMDB movie error:', err);
      return res.status(500).json({ message: 'Erro ao obter detalhes na TMDB' });
    }

    try {
      // 1) Ver se já existe na BD
      const [existing] = await db.query(
        'SELECT id_movie FROM movies WHERE tmdb_id = ?',
        [movie.id]
      );

      if (existing.length > 0) {
        return res.status(200).json({
          message: 'Filme já existia na BD',
          movieId: existing[0].id_movie
        });
      }

      // 2) Se não existir, inserir
      const [result] = await db.query(
        'INSERT INTO movies (title, synopsis, release_year, tmdb_id, poster_path) VALUES (?, ?, ?, ?, ?)',
        [
          movie.title,
          movie.overview,
          movie.release_date ? movie.release_date.slice(0, 4) : null,
          movie.id,
          movie.poster_path
        ]
      );

      res.status(201).json({
        message: 'Filme importado com sucesso',
        movieId: result.insertId       // este é o id_movie
      });
    } catch (dbErr) {
      console.error('DB error:', dbErr);
      res.status(500).json({ message: 'Erro ao guardar filme na BD' });
    }
  });
});


export default router;
