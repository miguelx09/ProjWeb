// server.js
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`FilmKeepr API a correr na porta ${PORT}`);
});
