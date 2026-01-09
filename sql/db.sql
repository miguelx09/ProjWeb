CREATE DATABASE IF NOT EXISTS filmkeepr
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE filmkeepr;

CREATE TABLE IF NOT EXISTS users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_admin TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS movies (
  id_movie INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  synopsis TEXT,
  duration_minutes INT,
  release_year INT,
  poster_url VARCHAR(500),
  poster_path VARCHAR(255),
  tmdb_id INT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tmdb_id (tmdb_id)
);

CREATE TABLE IF NOT EXISTS genres (
  id_genres INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id_movie) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id_genres) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  title VARCHAR(255),
  poster_path VARCHAR(500),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_movie_id (movie_id)
);

CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  title VARCHAR(255),
  poster_path VARCHAR(500),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_watchlist (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_movie_id (movie_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id_review INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  review_date DATE NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 10),
  comment TEXT,
  useful_votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_movie_id (movie_id)
);


ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS is_admin TINYINT(1) DEFAULT 0;

ALTER TABLE movies 
  ADD COLUMN IF NOT EXISTS poster_path VARCHAR(255) NULL;

ALTER TABLE favorites 
  ADD COLUMN IF NOT EXISTS id INT AUTO_INCREMENT PRIMARY KEY FIRST,
  ADD COLUMN IF NOT EXISTS title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS poster_path VARCHAR(500),
  ADD COLUMN IF NOT EXISTS added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE watchlist 
  ADD COLUMN IF NOT EXISTS id INT AUTO_INCREMENT PRIMARY KEY FIRST,
  ADD COLUMN IF NOT EXISTS title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS poster_path VARCHAR(500),
  ADD COLUMN IF NOT EXISTS added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;