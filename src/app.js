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
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // src/public

// ---------- API ----------
app.use('/api/watchlist', watchlistRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api', reviewsRouter);
app.use('/api', tmdbRouter);

// ---------- Backoffice admin (Mustache) ----------
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use('/', adminRouter); // rotas que fazem res.render('admin-movies', ...)

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

// NOVO: página dos favoritos
app.get('/favorites.html', (req, res) => {
  res.sendFile('favorites.html', { root: path.join(__dirname, 'views') });
});

// se não estiveres a usar estas rotas Mustache de /login e /register, remove-as:
// app.get('/login', (req, res) => res.render('login', { isLogin: true }));
// app.get('/register', (req, res) => res.render('register', { isRegister: true }));

export default app;
