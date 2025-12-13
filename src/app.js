import express from 'express';
import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';

app.use('/api/favorites', favoritesRouter);
const app = express();

app.use(express.json()); // isto é obrigatório

app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);

export default app;
