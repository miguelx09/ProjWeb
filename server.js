const express = require("express");
require('dotenv').config();
const app = express();
const cors = require("cors");

// Ligar a base de dados (o ficheiro faz a ligação quando é require'd)
require('./src/config/db');

app.use(express.json());
app.use(cors());

// Rotas
app.use("/auth", require("./src/routes/auth"));
app.use("/movies", require("./src/routes/movies"));
app.use("/reviews", require("./src/routes/reviews"));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(`API a correr na porta ${PORT}`));

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});

process.on('SIGTERM', () => {
	console.log('SIGTERM received, closing server');
	server.close(() => process.exit(0));
});
