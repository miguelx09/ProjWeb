import express from 'express';
import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';
import watchlistRouter from './routes/watchlist.js';
import reviewsRouter from './routes/reviews.js';
import tmdbRouter from './routes/tmdb.js';
import dotenv from 'dotenv';


const app = express();
dotenv.config();

app.use(express.json());
app.use('/api/watchlist', watchlistRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter); 
app.use('/api', reviewsRouter);
app.use('/api', tmdbRouter);

export default app;
