import express from 'express';
import db from '../db.js';

const router = express.Router();

// Rota para listar filmes no backoffice (Mustache)
router.get('/admin-movies', async (req, res) => {
  try {
    const [movies] = await db.query('SELECT * FROM movies ORDER BY created_at DESC');
    res.render('admin-movies', { movies });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar filmes');
  }
});

// Outras rotas Mustache que você possa ter...

export default router;
