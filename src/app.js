// src/app.js
import express from 'express';
import moviesRouter from './routes/movies.js';

const app = express();

app.use(express.json());
app.use('/api/movies', moviesRouter);

export default app;
