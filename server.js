const express = require('express');
const app = express();
require('dotenv').config();

// Ensure db.js exists in src/config and exports a connect function or runs connection on require
require('./src/config/db');

app.use(express.json());

const authRoutes = require('./src/routes/auth');
const movieRoutes = require('./src/routes/movies');
const reviewRoutes = require('./src/routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
