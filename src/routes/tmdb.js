import express from 'express';
import { searchMovies } from '../services/tmdb.js';

const router = express.Router();

// GET /api/tmdb/search?query=matrix
router.get('/tmdb/search', (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query é obrigatória' });
  }

  searchMovies(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao pesquisar na TMDB' });
    }
    res.json(result);
  });
});

export default router;
