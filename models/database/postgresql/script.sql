DROP TABLE movies, genre, movie_genre;
-- Crear tabla MOVIES
CREATE TABLE movies (id UUID primary key NOT NULL DEFAULT gen_random_uuid (),
								 nombre VARCHAR (255) NOT NULL,
								 release_year INT NOT NULL,
								 director VARCHAR(255) NOT NULL,
								 duration INT NOT NULL,
								 poster TEXT, 
								 rate DECIMAL(2, 1) NOT NULL);

-- Crear tabla para el Genero
create table genre(
	id serial primary key, 
	name varchar(255) not null
);

-- Crear la tabla relacional entre movies y genre
create table movie_genre(
	movie_id UUID references movies(id),
	genre_id serial references genre(id),
	primary key (movie_id, genre_id)
);


-- Add values to tables
insert into genre (name) values
('Drama'),
('Sci-Fi'),
('Adventure'),
('Crime'),
('Musical'),
('Action');

-- Insertar películas en la tabla 'movies'
INSERT INTO movies (nombre, release_year, director, duration, poster, rate)
VALUES 
    ('La La Land', 2016, 'Damien Chazelle', 128, 'https://pics.filmaffinity.com/la_la_land-262021831-mmed.jpg', 8.0),
    ('Inception', 2010, 'Christopher Nolan', 148, 'https://pics.filmaffinity.com/inception-652954101-mmed.jpg', 8.8),
    ('The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://pics.filmaffinity.com/the_shawshank_redemption-576140557-mmed.jpg', 9.3),
    ('The Godfather', 1972, 'Francis Ford Coppola', 175, 'https://pics.filmaffinity.com/the_godfather-488102675-mmed.jpg', 9.2),
    ( 'Forrest Gump', 1994, 'Robert Zemeckis', 142, 'https://pics.filmaffinity.com/forrest_gump-212765827-mmed.jpg', 8.8),
    ('Interstellar', 2014, 'Christopher Nolan', 169, 'https://pics.filmaffinity.com/interstellar-366875261-mmed.jpg', 8.6);

insert into movie_genre(movie_id, genre_id) values 
((select id from movies where nombre = 'La La Land'), (select id from genre where name = 'Musical')),
((select id from movies where nombre = 'La La Land'), (select id from genre where name = 'Drama')),
((SELECT id FROM movies WHERE nombre = 'Inception'), (SELECT id FROM genre WHERE name = 'Sci-Fi')),
((SELECT id FROM movies WHERE nombre = 'The Shawshank Redemption'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movies WHERE nombre = 'The Godfather'), (SELECT id FROM genre WHERE name = 'Crime')),
((SELECT id FROM movies WHERE nombre = 'Forrest Gump'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movies WHERE nombre = 'Interstellar'), (SELECT id FROM genre WHERE name = 'Action')),
((SELECT id FROM movies WHERE nombre = 'Interstellar'), (SELECT id FROM genre WHERE name = 'Sci-Fi'));

select * from movies;