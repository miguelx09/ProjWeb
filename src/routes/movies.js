// src/routes/movies.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/movies  -> lista todos os filmes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM movies');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter filmes' });
  }
});

export default router;
