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

import { authenticateToken, requireAdmin } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api', reviewsRouter);
app.use('/api', tmdbRouter);

app.use('/api/favorites', authenticateToken, favoritesRouter);
app.use('/api/watchlist', authenticateToken, watchlistRouter);

app.use('/api/admin', authenticateToken, requireAdmin, adminUsersRouter);

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use('/admin', adminRouter);

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

export default app;
