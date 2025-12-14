import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.use(express.static(path.join(__dirname, 'public'))); // serve src/public

// rotas API
app.use('/api/watchlist', watchlistRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api', reviewsRouter);
app.use('/api', tmdbRouter);

// backoffice admin (usa views/admin-movies.html, etc.)
app.use('/', adminRouter);

// página inicial
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'views') });
});

// restantes páginas front
app.get('/login.html', (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, 'views') });
});

app.get('/register.html', (req, res) => {
  res.sendFile('register.html', { root: path.join(__dirname, 'views') });
});

app.get('/search.html', (req, res) => {
  res.sendFile('search.html', { root: path.join(__dirname, 'views') });
});

export default app;
