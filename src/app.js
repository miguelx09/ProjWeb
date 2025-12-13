import express from 'express';
import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';

const app = express();
app.use(express.json());

app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter); // <-- esta linha

export default app;
