import express from 'express';
import {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getTopRatedMovies
} from '../services/tmdb.js';

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
    res.json(result); // { page, results, ... }
  });
});

// GET /api/tmdb/movie/:id
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

// GET /api/tmdb/popular
router.get('/tmdb/popular', (req, res) => {
  getPopularMovies((err, result) => {
    if (err) {
      console.error('TMDB popular error:', err);
      return res.status(500).json({ message: 'Erro ao obter populares' });
    }
    res.json(result); // também vem como { page, results, ... }
  });
});

// GET /api/tmdb/top-rated
router.get('/tmdb/top-rated', (req, res) => {
  getTopRatedMovies((err, result) => {
    if (err) {
      console.error('TMDB top-rated error:', err);
      return res.status(500).json({ message: 'Erro ao obter melhor avaliados' });
    }
    res.json(result);
  });
});

// POST /api/tmdb/import/:id  -> fica igual ao teu código atual
router.post('/tmdb/import/:id', (req, res) => {
  const { id } = req.params;

  getMovieDetails(id, async (err, movie) => {
    if (err) {
      console.error('TMDB movie error:', err);
      return res.status(500).json({ message: 'Erro ao obter detalhes na TMDB' });
    }

    try {
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
        movieId: result.insertId
      });
    } catch (dbErr) {
      console.error('DB error:', dbErr);
      res.status(500).json({ message: 'Erro ao guardar filme na BD' });
    }
  });
});

// GET /tmdb/upcoming
router.get('/tmdb/upcoming', async (req, res) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=pt-PT&page=1`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter filmes em breve' });
  }
});


export default router;
