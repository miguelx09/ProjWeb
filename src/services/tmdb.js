import tmdbv3 from 'tmdbv3';
import dotenv from 'dotenv';

dotenv.config();

const tmdb = tmdbv3.init(process.env.TMDB_API_KEY);
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// pesquisar filmes por texto
export function searchMovies(query, callback) {
  tmdb.search.movie(query, callback);
}

// detalhes de um filme por ID TMDB
export function getMovieDetails(tmdbId, callback) {
  tmdb.movie.info(tmdbId, callback);
}

// filmes populares (usa fetch direto à API TMDB)
export async function getPopularMovies(callback) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-PT&page=1`
    );
    const data = await res.json();
    callback(null, data); // { page, results, ... }
  } catch (err) {
    callback(err);
  }
}

// filmes melhor avaliados
export async function getTopRatedMovies(callback) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-PT&page=1`
    );
    const data = await res.json();
    callback(null, data);
  } catch (err) {
    callback(err);
  }
}

// Filmes em breve (usa fetch direto à API TMDB)
export async function getUpcomingMovies(callback) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=pt-PT&page=1`
    );
    const data = await res.json();
    callback(null, data);
  } catch (err) {
    callback(err);
  }
}

// Filmes por género
export async function getMoviesByGenre(genreId, callback) {
  try {
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-PT&with_genres=${genreId}&sort_by=popularity.desc&page=1`
    );
    const data = await res.json();
    callback(null, data);
  } catch (err) {
    callback(err);
  }
}

// Créditos (elenco e equipa)
export async function getMovieCredits(tmdbId, callback) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${tmdbId}/credits?api_key=${API_KEY}&language=pt-PT`
    );
    const data = await res.json();
    callback(null, data);
  } catch (err) {
    callback(err);
  }
}



