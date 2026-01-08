import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_simples';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    req.user = user; // { id_user, username }
    next();
  });
};

export const requireAdmin = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT is_admin FROM users WHERE id_user = ?',
      [req.user.id_user]
    );

    if (rows.length === 0 || !rows[0].is_admin) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao verificar permissões' });
  }
};
