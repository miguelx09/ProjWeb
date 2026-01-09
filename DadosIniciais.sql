-- ==================== SCRIPT DE RESET E POPULATE ====================
-- Este script limpa toda a base de dados e preenche com dados iniciais
-- ⚠️ ATENÇÃO: Vai apagar TODOS os dados existentes!
-- ==================== ==================== ====================

USE filmkeepr;

-- ==================== 1. DESATIVAR VERIFICAÇÕES DE CHAVES ESTRANGEIRAS ====================
SET FOREIGN_KEY_CHECKS = 0;

-- ==================== 2. LIMPAR TODAS AS TABELAS ====================
TRUNCATE TABLE reviews;
TRUNCATE TABLE watchlist;
TRUNCATE TABLE favorites;
TRUNCATE TABLE movie_genres;
TRUNCATE TABLE genres;
TRUNCATE TABLE movies;
TRUNCATE TABLE users;

-- ==================== 3. REATIVAR VERIFICAÇÕES ====================
SET FOREIGN_KEY_CHECKS = 1;

-- ==================== 4. INSERIR UTILIZADORES ====================
-- Passwords: Para todos os utilizadores a password é "123456"
-- Hash gerado com bcrypt (10 rounds): $2b$10$YX5V5YfVqJ5V5YfVqJ5V5.N5V5YfVqJ5V5YfVqJ5V5YfVqJ5V5Y

INSERT INTO users (username, email, password_hash, is_admin) VALUES
('root', 'admin@filmkeepr.com', '$2b$10$K8qJ5v5YfVqJ5V5YfVqJ5.V5YfVqJ5V5YfVqJ5V5YfVqJ5V5YfVq', 1),
('miguel', 'miguel@gmail.com', '$2b$10$K8qJ5v5YfVqJ5V5YfVqJ5.V5YfVqJ5V5YfVqJ5V5YfVqJ5V5YfVq', 0),
('norberto', 'norberto@gmail.com', '$2b$10$K8qJ5v5YfVqJ5V5YfVqJ5.V5YfVqJ5V5YfVqJ5V5YfVqJ5V5YfVq', 0),
('maria', 'maria@gmail.com', '$2b$10$K8qJ5v5YfVqJ5V5YfVqJ5.V5YfVqJ5V5YfVqJ5V5YfVqJ5V5YfVq', 0),
('joao', 'joao@gmail.com', '$2b$10$K8qJ5v5YfVqJ5V5YfVqJ5.V5YfVqJ5V5YfVqJ5V5YfVqJ5V5YfVq', 0);

-- ==================== 5. INSERIR FILMES ====================
INSERT INTO movies (title, synopsis, duration_minutes, release_year, poster_path, tmdb_id) VALUES
('The Shawshank Redemption', 'Dois homens presos desenvolvem uma amizade ao longo de vários anos.', 142, 1994, '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 278),
('The Godfather', 'O patriarca envelhecido de uma dinastia do crime organizado.', 175, 1972, '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 238),
('The Dark Knight', 'Batman enfrenta o Coringa em Gotham.', 152, 2008, '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 155),
('Pulp Fiction', 'Histórias entrelaçadas de violência e redenção.', 154, 1994, '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 680),
('Forrest Gump', 'A vida extraordinária de um homem simples.', 142, 1994, '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 13),
('Inception', 'Roubo de ideias através dos sonhos.', 148, 2010, '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 27205),
('The Matrix', 'A realidade é uma simulação controlada por máquinas.', 136, 1999, '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 603),
('Interstellar', 'Viagem espacial para salvar a humanidade.', 169, 2014, '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 157336),
('The Lion King', 'Simba deve aceitar seu destino como rei.', 88, 1994, '/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', 8587),
('Toy Story', 'Brinquedos ganham vida quando humanos não estão.', 81, 1995, '/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', 862);

-- ==================== 6. INSERIR FAVORITOS (SEM TITLE/POSTER_PATH) ====================
INSERT INTO favorites (user_id, movie_id) VALUES
(2, 1),  -- Miguel: The Shawshank Redemption
(2, 6),  -- Miguel: Inception
(2, 7),  -- Miguel: The Matrix
(3, 3),  -- Norberto: The Dark Knight
(3, 4),  -- Norberto: Pulp Fiction
(3, 8),  -- Norberto: Interstellar
(4, 5),  -- Maria: Forrest Gump
(4, 9),  -- Maria: The Lion King
(4, 10); -- Maria: Toy Story

-- ==================== 7. INSERIR WATCHLIST (SEM TITLE/POSTER_PATH) ====================
INSERT INTO watchlist (user_id, movie_id) VALUES
(2, 2),  -- Miguel: The Godfather
(2, 4),  -- Miguel: Pulp Fiction
(3, 1),  -- Norberto: The Shawshank Redemption
(3, 9),  -- Norberto: The Lion King
(5, 6),  -- João: Inception
(5, 8),  -- João: Interstellar
(5, 7);  -- João: The Matrix

-- ==================== 8. INSERIR REVIEWS ====================
INSERT INTO reviews (user_id, movie_id, review_date, rating, comment) VALUES
(2, 1, '2024-01-15', 10, 'Obra-prima absoluta!'),
(2, 6, '2024-02-20', 9, 'Complexo e fascinante.'),
(2, 7, '2024-03-10', 9, 'Revolucionário!'),
(3, 3, '2024-01-20', 10, 'Heath Ledger está fenomenal.'),
(3, 4, '2024-02-15', 9, 'Diálogos brilhantes.'),
(3, 8, '2024-03-05', 10, 'Emocionante!'),
(4, 5, '2024-01-25', 9, 'Inspirador.'),
(4, 9, '2024-02-10', 10, 'Clássico da Disney.'),
(4, 10, '2024-03-01', 9, 'Animação revolucionária.'),
(5, 2, '2024-01-30', 10, 'Melhor filme de gangsters.'),
(5, 7, '2024-02-25', 9, 'Efeitos especiais incríveis.');

set sql_safe_updates = 0;
UPDATE users SET password_hash = '$2b$10$0hS0XcrkHmOh5mHXRza.beWXZDIIrpO0C1Y4X/MvBVoYEey2zT2oW';
set sql_safe_updates =0;


-- ==================== 12. INFORMAÇÕES IMPORTANTES ====================


-- ⚠️ NOTA SOBRE PASSWORDS:
-- Todos os utilizadores têm a password: "123456"
-- O hash fornecido é apenas um exemplo placeholder
-- 
-- Para gerar o hash correto da password "123456", executa no Node.js:
-- 
--  CASO DE ERRO AO FAZER LOGIN DEVE-SE EXECUTAR O FICHEIRO generate-hash.node e copiar a hash apos isso exeturar o seguinte codigo e colar a hash no 'HASH_REAl_AQUI'
-- UPDATE users SET password_hash = 'HASH_REAL_AQUI';

-- ==================== FIM DO SCRIPT ==================== 
-- Credenciais de acesso:
-- Admin: root / 123456
-- Users: miguel, norberto, maria, joao / 123456
-- Total de registos:
-- - 5 utilizadores (1 admin)
-- - 10 filmes
-- - 18 géneros
-- - 9 favoritos
-- - 7 watchlist
-- - 10 reviews

