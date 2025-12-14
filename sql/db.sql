CREATE DATABASE IF NOT EXISTS filmkeepr
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE filmkeepr;


CREATE TABLE users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Filmes / Séries
CREATE TABLE movies (
  id_movie INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  synopsis TEXT,
  duration_minutes INT,
  release_year INT,
  poster_url VARCHAR(500),
  tmdb_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Géneros
CREATE TABLE genres (
  id_genres INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Relação N:N filmes <-> géneros
CREATE TABLE movie_genres (
  movie_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id_movie) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id_genres) ON DELETE CASCADE
);

-- Favoritos
CREATE TABLE favorites (
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id_movie) ON DELETE CASCADE
);

-- Ver mais tarde (watchlist)
CREATE TABLE watchlist (
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id_movie) ON DELETE CASCADE
);

-- Reviews
CREATE TABLE reviews (
  id_review INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  review_date DATE NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  useful_votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id_movie) ON DELETE CASCADE
);

ALTER TABLE movies
ADD COLUMN poster_path VARCHAR(255) NULL;


SELECT id_movie, title, synopsis, release_year, tmdb_id, poster_path FROM movies WHERE id_movie = ?
