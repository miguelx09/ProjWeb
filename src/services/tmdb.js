import tmdbv3 from 'tmdbv3';
import dotenv from 'dotenv';

dotenv.config();

const tmdb = tmdbv3.init(process.env.TMDB_API_KEY);

// pesquisar filmes por texto
export function searchMovies(query, callback) {
  tmdb.search.movie(query, callback);
}

// detalhes de um filme por ID TMDB
export function getMovieDetails(tmdbId, callback) {
  tmdb.movie.info(tmdbId, callback);
}
