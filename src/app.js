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
import adminUsersRouter from './routes/admin.js'; // ← CORRIGIDO: ficheiro diferente
import dotenv from 'dotenv';

// Importar middleware de autenticação
import { authenticateToken, requireAdmin } from './middleware/authMiddleware.js'; // ← ADICIONAR

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- API PÚBLICAS (sem autenticação) ----------
app.use('/api/auth', authRouter);           // Login e Register
app.use('/api/movies', moviesRouter);       // Listar filmes
app.use('/api', reviewsRouter);             // Reviews
app.use('/api', tmdbRouter);                // TMDB

// ---------- API PROTEGIDAS (requer autenticação) ----------
app.use('/api/favorites', authenticateToken, favoritesRouter);    // ← ADICIONAR authenticateToken
app.use('/api/watchlist', authenticateToken, watchlistRouter);    // ← ADICIONAR authenticateToken

// ---------- API ADMIN (requer autenticação + admin) ----------
app.use('/api/admin', authenticateToken, requireAdmin, adminUsersRouter); // ← ADICIONAR middleware

// ---------- Backoffice admin (Mustache) ----------
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use('/', adminRouter);

// ---------- Frontoffice (ficheiros HTML estáticos) ----------
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'views') });
});

app.get('/login.html', (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, 'views') });
});

app.get('/register.html', (req, res) => {
  res.sendFile('register.html', { root: path.join(__dirname, 'views') });
});

app.get('/search.html', (req, res) => {
  res.sendFile('search.html', { root: path.join(__dirname, 'views') });
});

app.get('/watchlist.html', (req, res) => {
  res.sendFile('watchlist.html', { root: path.join(__dirname, 'views') });
});

app.get('/favorites.html', (req, res) => {
  res.sendFile('favorites.html', { root: path.join(__dirname, 'views') });
});

app.get('/admin.html', (req, res) => {
  res.sendFile('admin.html', { root: path.join(__dirname, 'views') });
});

export default app;
