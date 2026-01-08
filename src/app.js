import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import mustacheExpress from 'mustache-express';
import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';
import watchlistRouter from './routes/watchlist.js';
import reviewsRouter from './routes/reviews.js';
import tmdbRouter from './routes/tmdb.js';
import adminRouter from './routes/admin.js';
import adminUsersRouter from './routes/adminUsers.js';
import dotenv from 'dotenv';

// Importar middleware de autenticação
import { authenticateToken, requireAdmin } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsing de JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir ficheiros estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// ---------- API PÚBLICAS (sem autenticação) ----------
app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api', reviewsRouter);
app.use('/api', tmdbRouter);

// ---------- API PROTEGIDAS (requer autenticação) ----------
app.use('/api/favorites', authenticateToken, favoritesRouter);
app.use('/api/watchlist', authenticateToken, watchlistRouter);

// ---------- API ADMIN (requer autenticação + admin) ----------
app.use('/api/admin', authenticateToken, requireAdmin, adminUsersRouter);

// ---------- Backoffice admin (Mustache) ----------
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Rotas admin com prefixo /admin
app.use('/admin', adminRouter);

// ---------- Middleware de fallback (DEVE ESTAR NO FINAL) ----------
app.use((req, res) => {
  // Se for uma rota de API que não existe, retorna 404 JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  
  // Caso contrário, serve o index.html para SPAs
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

export default app;
