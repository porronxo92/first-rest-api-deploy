//LOGICA DE NEGOCIO
//VALIDACION QUE SE HACEN EN EL MODELO:
//Validaciones de datos para perpetuar la integridad de los datos. Por ejemplo, validaciones de los datos de la bbdd,

import pg from 'pg'

//validaciones de que un dato es INT y no STRING, o si un id ya existe.
const DATABASE_URL_LOCAL = 'postgres://user_root:ruben.2409@localhost:5432/movies_database'
const DATABASE_URL = process.env.DATABASE_URL || DATABASE_URL_LOCAL
const client = new pg.Client(DATABASE_URL)
await client.connect()

//LO IMPORTANTE ENTRE MODELOS DEL MISMO RECURSO, ES QUE CUMPLA EL MISMO CONTRATO ESTABLECIDO DE METODOS Y CLASES
export class MovieModel {
  static async getAll() {
    const { rows } = await client.query('SELECT * from movies;')
    return rows
  }

  static async getAllMovies({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const queryByGenre = `SELECT *
          FROM movies m
          WHERE EXISTS (
              SELECT *
              FROM movie_genre mg
              JOIN genre g ON mg.genre_id = g.id
              WHERE mg.movie_id = m.id
              AND LOWER(g.name) = '${lowerCaseGenre}');` //hacer asi la query nos exponemos a tener ataques de SQL Injection
      //los valores de la query no pueden ir con ${}

      const { rows } = await client.query(
        `select * from movies m 
          join movie_genre mg 
          on m.id = mg.movie_id 
          join genre g 
          on g.id = mg.genre_id 
          where lower(g.name) = $1; `,
        [lowerCaseGenre]
      )
      return rows
    } else {
      return await this.getAll()
    }
  }

  static async getById({ id }) {
    try {
      const { rows } = await client.query('SELECT * FROM movies WHERE id = $1;', [id])
      const [movie] = rows
      return movie
    } catch (error) {
      console.error(error.message)
    }
  }

  static async create({ input }) {
    const { name, release_year, director, duration, poster, rate, genre } = input
    const resultUUID = await client.query('SELECT gen_random_uuid () as uuid;')
    const {
      rows: [{ uuid }],
    } = resultUUID

    try {
      await client.query(
        `
        INSERT INTO movies (id, nombre, release_year, director, duration, poster, rate) values ($1, $2, $3, $4, $5, $6, $7);`,
        [uuid, name, release_year, director, duration, poster, rate]
      )

      if (genre) {
        const lowerCaseGenre = genre[0].toLowerCase()
        console.log('Genero:', genre)
        const {
          rows: [{ id }],
        } = await client.query('SELECT id from genre WHERE LOWER(name) = $1', [lowerCaseGenre])
        console.log('idGenre', id)
        await client.query(
          `
               INSERT INTO movie_genre (movie_id, genre_id) values ($1, $2);`,
          [uuid, id]
        )
      }
      const { rows } = await client.query('SELECT * FROM movies WHERE id = $1', [uuid])
      console.log(rows)
      const [newMovie] = rows
      console.log(newMovie)
      return newMovie
    } catch (error) {
      console.error(error.message)
    }
  }

  static async delete({ id }) {
    try {
      const result_mg = await client.query('DELETE FROM movie_genre WHERE movie_id = $1;', [id])
      const result_movie = await client.query('DELETE FROM movies WHERE id = $1;', [id])

      if (result_mg.rowCount > 0 && result_movie.rowCount > 0) {
        return true
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  static async update({ id, input }) {
    try {
      const parametros = Object.entries(input)
        .map(([key], index) => {
          return `${key} = $${index + 2}` // Añadir 2 para omitir el primer parámetro (id)
        })
        .join(', ')

      console.log(parametros)
      const valores = Object.entries(input).map(([key, value]) => {
        return value // Añadir 2 para omitir el primer parámetro (id)
      })
      valores.unshift(id)
      console.log(valores)

      const { rowCount } = await client.query(
        `
      UPDATE movies
      SET ${parametros}
      where id = $1
      `,
        valores
      )
      console.log(`Se actualizaron ${rowCount} filas.`)
      const { rows } = await client.query('SELECT * FROM movies WHERE id = $1;', [id])
      console.log(rows)
      return rows
    } catch (error) {
      console.error('Error al actualizar la película:', error.message)
    }
  }
}
