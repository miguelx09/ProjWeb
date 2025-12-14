import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM movies');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter filmes' });
  }
});

router.get('/:id_movie', async (req, res) => {
  const { id_movie } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM movies WHERE id_movie = ?',
      [id_movie]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter filme' });
  }
});

// GET /api/movies  -> lista todos os filmes da BD
router.get('/movies', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, synopsis, release_year, tmdb_id, poster_path FROM movies'
    );
    res.json(rows);
  } catch (err) {
    console.error('DB list movies error:', err);
    res.status(500).json({ message: 'Erro ao listar filmes' });
  }
});

router.get('/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id, title, synopsis, release_year, tmdb_id, poster_path FROM movies WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('DB get movie error:', err);
    res.status(500).json({ message: 'Erro ao obter filme' });
  }
});

router.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, synopsis, release_year, poster_path } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE movies SET title = ?, synopsis = ?, release_year = ?, poster_path = ? WHERE id = ?',
      [title, synopsis, release_year, poster_path, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    res.json({ message: 'Filme atualizado com sucesso' });
  } catch (err) {
    console.error('DB update movie error:', err);
    res.status(500).json({ message: 'Erro ao atualizar filme' });
  }
});


export default router;
