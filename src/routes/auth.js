import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = 'segredo_super_simples'; // depois podes meter no .env

// POST /api/auth/register
router.post('/register', async (req, res) => {
  console.log('BODY RECEBIDO:', req.body);

  const { name, email, password } = req.body;

  try {
    // verificar se já existe email
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email já registado' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password_hash]
    );

    res.status(201).json({ id_user: result.insertId, username: name, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no registo' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { 
        id_user: user.id_user, 
        username: user.username,
        is_admin: user.is_admin || false  // ← ADICIONAR
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // AQUI: devolve também o username E is_admin
    res.json({
      token,
      username: user.username,
      is_admin: user.is_admin || false  // ← ADICIONAR
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no login' });
  }
});

export default router;
