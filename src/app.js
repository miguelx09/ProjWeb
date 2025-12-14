import express from 'express';
import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';
import watchlistRouter from './routes/watchlist.js';
import reviewsRouter from './routes/reviews.js';
import tmdbRouter from './routes/tmdb.js';
import dotenv from 'dotenv';
import adminRouter from './routes/admin.js';


const app = express();
dotenv.config();

app.use(express.json());
app.use(express.static('src/public'));
app.use('/api/watchlist', watchlistRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter); 
app.use('/api', reviewsRouter);
app.use('/api', tmdbRouter);
app.use('/api', moviesRouter);
app.use('/', adminRouter);


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'src/views' });
});

export default app;