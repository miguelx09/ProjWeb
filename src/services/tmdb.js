import tmdbv3 from 'tmdbv3';
import dotenv from 'dotenv';

dotenv.config();

// só para confirmar que a key está a vir do .env (podes apagar depois)
console.log('TMDB KEY:', process.env.TMDB_API_KEY);

const tmdb = tmdbv3.init(process.env.TMDB_API_KEY);

// pesquisar filmes por texto
export function searchMovies(query, callback) {
  tmdb.search.movie(query, callback);
}

// detalhes de um filme por ID TMDB
export function getMovieDetails(tmdbId, callback) {
  tmdb.movie.info(tmdbId, callback);
}
