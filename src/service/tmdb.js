import tmdbv3 from 'tmdbv3';
import dotenv from 'dotenv';

dotenv.config();

const tmdb = tmdbv3.init('961d3f7e26beb8b8e0f9b41a6bfa6f42');

// pesquisar filmes por texto
export function searchMovies(query, callback) {
  tmdb.search.movie(query, callback);
}

// detalhes de um filme por ID TMDB
export function getMovieDetails(tmdbId, callback) {
  tmdb.movie.info(tmdbId, callback);
}
