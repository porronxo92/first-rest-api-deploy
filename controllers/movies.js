//CONTROLADOR - ORQUESTADOR.
//Actuara de intermediario entre la Vista y el modelo. Es el que se encarga de recoger los datos, validar que todos estan bien
// y comprobar que los datos que se van a pasar a la logica de negocio no sean malos, peligrosos...

//import { MovieModel } from '../models/database/postgresql/movie.js'
// import { MovieModel } from '../models/local-fs/movie.js'
import { validateMovie, validatePartialMovie } from '../schema/movies.js'

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel
  }

  pruebaBBDD = async (req, res) => {
    return res.json(await this.movieModel.pruebaBBDD())
  }

  getAllMovies = async (req, res) => {
    try {
      const { genre } = req.query
      //con asyn-await necesitamos try-catch si o si
      const movies = await this.movieModel.getAllMovies({ genre })
      return res.json(movies)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ message: `ERROR 500: Internal Server Error` })
    }
  }

  getById = async (req, res) => {
    const { id } = req.params
    try {
      const movie = await this.movieModel.getById({ id })
      if (movie) return res.json(movie)
      return res.status(404).json({ message: 'Error 404: Movie not found' })
    } catch (error) {
      console.error(error.message)
    }
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)
    if (result.error) {
      return res.status(400).json({ message: result.error.message }) //Error 400: Bad Request, el cliente ha hecho mal para la peticion
    }

    const newMovie = await this.movieModel.create({ input: result.data })
    return res.status(201).json(newMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = validatePartialMovie(req.body)

    if (result.error) {
      return res.status(400).json({ message: result.error.message }) //Error 400: Bad Request, el cliente ha hecho mal para la peticion
    }
    const movieDelete = await this.movieModel.delete({ id })
    if (!movieDelete) return res.status(404).json({ message: 'Error 404: Movie not found' })
    return res.json({ message: 'Movie deleted' })
  }

  update = async (req, res) => {
    const { id } = req.params
    const result = validatePartialMovie(req.body)

    if (result.error) {
      return res.status(400).json({ message: result.error.message }) //Error 400: Bad Request, el cliente ha hecho mal para la peticion
    }
    const updateMovie = await this.movieModel.update({ id, input: result.data })

    if (!updateMovie) return res.status(404).json({ message: 'Error 404: Movie not found' })

    return res.status(201).json(updateMovie)
  }
}
