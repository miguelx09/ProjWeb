// src/routes/movies.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

// (opcional) GET /api/movies-base -> SELECT * FROM movies
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM movies');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter filmes' });
  }
});

// GET /api/movies/:id_movie  (se quiseres manter esta rota antiga)
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

// GET /api/movies  -> lista todos os filmes com campos selecionados
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

// GET /api/movies/:id  -> detalhe (versão nova)
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

// PUT /api/movies/:id  -> atualizar filme
router.put('/movies/:id', async (req, res) => {
  const { id } = req.params; // continua a chamar-se id na rota
  const { title, synopsis, release_year, poster_path } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE movies SET title = ?, synopsis = ?, release_year = ?, poster_path = ? WHERE id_movie = ?',
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

// DELETE /api/movies/2
router.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM movies WHERE id_movie = ?',   // <-- usa id_movie
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    res.json({ message: 'Filme apagado com sucesso' });
  } catch (err) {
    console.error('DB delete movie error:', err);
    res.status(500).json({ message: 'Erro ao apagar filme' });
  }
});




export default router;
