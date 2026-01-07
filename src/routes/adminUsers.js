import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';

const router = express.Router();

// NOTA: authenticateToken e requireAdmin já são aplicados no app.js
// Por isso todas as rotas aqui já estão protegidas

// ==================== GESTÃO DE UTILIZADORES ====================

// GET /api/admin/users - Listar todos os utilizadores
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        id_user, 
        username, 
        email, 
        is_admin, 
        created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar utilizadores' });
  }
});

// GET /api/admin/users/:id - Obter detalhes de um utilizador específico
router.get('/users/:id', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id_user, username, email, is_admin, created_at FROM users WHERE id_user = ?',
      [req.params.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }
    
    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter utilizador' });
  }
});

// PUT /api/admin/users/:id - Editar utilizador
router.put('/users/:id', async (req, res) => {
  const { username, email, is_admin, new_password } = req.body;
  
  try {
    // Verificar se o utilizador existe
    const [existing] = await db.query('SELECT * FROM users WHERE id_user = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    // Impedir que o admin remova seu próprio status de admin
    if (req.user.id_user == req.params.id && is_admin === false) {
      return res.status(400).json({ message: 'Não pode remover o seu próprio status de admin' });
    }

    // Construir query de atualização
    let query = 'UPDATE users SET username = ?, email = ?, is_admin = ?';
    let params = [username, email, is_admin];

    // Se forneceu nova password, adicionar ao update
    if (new_password && new_password.trim() !== '') {
      const password_hash = await bcrypt.hash(new_password, 10);
      query += ', password_hash = ?';
      params.push(password_hash);
    }

    query += ' WHERE id_user = ?';
    params.push(req.params.id);

    await db.query(query, params);

    res.json({ message: 'Utilizador atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar utilizador' });
  }
});

// DELETE /api/admin/users/:id - Apagar utilizador
router.delete('/users/:id', async (req, res) => {
  try {
    // Impedir que o admin apague a própria conta
    if (req.user.id_user == req.params.id) {
      return res.status(400).json({ message: 'Não pode apagar a sua própria conta' });
    }

    // Apagar dados relacionados primeiro (integridade referencial)
    await db.query('DELETE FROM reviews WHERE id_user = ?', [req.params.id]);
    await db.query('DELETE FROM favorites WHERE id_user = ?', [req.params.id]);
    await db.query('DELETE FROM watchlist WHERE id_user = ?', [req.params.id]);

    // Apagar utilizador
    const [result] = await db.query('DELETE FROM users WHERE id_user = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    res.json({ message: 'Utilizador apagado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao apagar utilizador' });
  }
});

// ==================== GESTÃO DE FILMES ====================

// GET /api/admin/movies - Listar todos os filmes importados
// GET /api/admin/movies - Listar filmes importados
router.get('/movies', async (req, res) => {
  try {
    const [movies] = await db.query(`
      SELECT 
        id_movie,
        title,
        synopsis,
        duration_minutes,
        release_year,
        poster_url,
        tmdb_id,
        created_at,
        poster_path
      FROM movies 
      ORDER BY created_at DESC
    `);
    res.json(movies);
  } catch (err) {
    console.error('Erro ao listar filmes:', err); // ← Ver erro no terminal
    res.status(500).json({ message: 'Erro ao listar filmes', error: err.message });
  }
});


// ==================== ESTATÍSTICAS ====================

// GET /api/admin/stats - Obter estatísticas gerais do sistema
router.get('/stats', async (req, res) => {
  try {
    const [userCount] = await db.query('SELECT COUNT(*) as total FROM users');
    const [movieCount] = await db.query('SELECT COUNT(*) as total FROM movies');
    const [reviewCount] = await db.query('SELECT COUNT(*) as total FROM reviews');
    const [favoriteCount] = await db.query('SELECT COUNT(*) as total FROM favorites');

    res.json({
      users: userCount[0].total,
      movies: movieCount[0].total,
      reviews: reviewCount[0].total,
      favorites: favoriteCount[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter estatísticas' });
  }
});

export default router;
