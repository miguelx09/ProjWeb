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

export default router;
