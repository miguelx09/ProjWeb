import express from 'express';
import { searchMovies, getMovieDetails } from '../services/tmdb.js';

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

export default router;
