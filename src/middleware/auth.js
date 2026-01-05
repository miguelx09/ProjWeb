import jwt from 'jsonwebtoken';

const JWT_SECRET = 'segredo_super_simples'; // ou process.env.JWT_SECRET

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token em falta' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id_user, username }
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
