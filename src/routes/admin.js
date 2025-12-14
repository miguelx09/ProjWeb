// src/routes/admin.js
import express from 'express';
const router = express.Router();

// Página de lista de filmes (HTML simples por agora)
router.get('/admin/movies', (req, res) => {
  res.sendFile('admin-movies.html', { root: 'src/views' });
});

export default router;
