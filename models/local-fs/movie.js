//LOGICA DE NEGOCIO
//VALIDACION QUE SE HACEN EN EL MODELO:
//Validaciones de datos para perpetuar la integridad de los datos. Por ejemplo, validaciones de los datos de la bbdd,
//validaciones de que un dato es INT y no STRING, o si un id ya existe.

import { readJSON } from '../../utils.js'
import { randomUUID } from 'node:crypto' //para generar UUID v4

const movies = readJSON('./movies.json')

//LO IMPORTANTE ENTRE MODELOS DEL MISMO RECURSO, ES QUE CUMPLA EL MISMO CONTRATO ESTABLECIDO DE METODOS Y CLASES
export class MovieModel {
  static async getAllMovies({ genre }) {
    if (genre) {
      return movies.filter((movie) => movie.genre.toLowerCase() == genre.toLowerCase())
    }
    return movies
  }

  static async getById({ id }) {
    const movie = movies.find((movie) => movie.id == id)
    return movie
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    }
    movies.push(newMovie)
    return newMovie
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id == id)
    if (movieIndex == -1) return false
    movies.splice(movieIndex, 1)
    return true
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id == id)

    if (movieIndex == -1) return false
    const updateMovie = { ...movies[movieIndex], ...input }

    movies.splice(movieIndex, 1, updateMovie)
    //movies[movieIndex] = updateMovie

    return updateMovie
  }
}
