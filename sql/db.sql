-- =============================
-- CRIAR BASE DE DADOS
-- =============================
DROP DATABASE IF EXISTS filmesdb;
CREATE DATABASE filmesdb;
USE filmesdb;

-- =============================
-- TABLE: users
-- =============================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- TABLE: genres
-- =============================
CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

-- =============================
-- TABLE: people (atores / diretores)
-- =============================
CREATE TABLE people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo ENUM('ator','diretor','criador') NOT NULL
);

-- =============================
-- TABLE: movies
-- =============================
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sinopse TEXT,
    duracao INT,
    ano INT,
    tipo ENUM('filme','serie') DEFAULT 'filme',
    diretor_id INT,
    poster VARCHAR(255),
    trailer VARCHAR(255),
    FOREIGN KEY (diretor_id) REFERENCES people(id)
);

-- =============================
-- TABLE: movie_genres (N:N)
-- =============================
CREATE TABLE movie_genres (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY(movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- =============================
-- TABLE: elenco (N:N)
-- =============================
CREATE TABLE movie_cast (
    movie_id INT,
    person_id INT,
    papel VARCHAR(150),
    PRIMARY KEY(movie_id, person_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
);

-- =============================
-- TABLE: reviews
-- =============================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    classificacao INT CHECK (classificacao BETWEEN 1 AND 10),
    critica TEXT,
    votos_util INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- =============================
-- TABLE: votos de utilidade (quem votou)
-- =============================
CREATE TABLE review_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT,
    user_id INT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(review_id, user_id),
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================
-- TABLE: favoritos
-- =============================
CREATE TABLE user_favorites (
    user_id INT,
    movie_id INT,
    PRIMARY KEY(user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- =============================
-- TABLE: listas personalizadas
-- =============================
CREATE TABLE lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =============================
-- TABLE: items da lista (N:N)
-- =============================
CREATE TABLE list_items (
    list_id INT,
    movie_id INT,
    PRIMARY KEY(list_id, movie_id),
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- =============================
-- INSERTS DE EXEMPLO
-- =============================

INSERT INTO users (nome, email, password)
VALUES ('Admin', 'admin@site.com', 'HASH_AQUI');

INSERT INTO genres (nome)
VALUES ('Ação'), ('Drama'), ('Comédia'), ('Sci-Fi');

INSERT INTO people (nome, tipo)
VALUES ('Christopher Nolan', 'diretor'),
       ('Robert Downey Jr.', 'ator'),
       ('Scarlett Johansson', 'ator');

INSERT INTO movies (nome, sinopse, duracao, ano, tipo, diretor_id)
VALUES ('Oppenheimer', 'Filme sobre a criação da bomba atómica.', 180, 2023, 'filme', 1);

INSERT INTO movie_genres VALUES (1, 2);

INSERT INTO movie_cast VALUES (1, 2, 'Oppenheimer');
