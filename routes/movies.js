import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

export const CreateMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()
  const movieController = new MovieController({ movieModel })

  //Todos los recursos se identifican con una URL, por lo que todo lo que se requiera de las MOVIES se identifica con /movies
  //queryParam, los valores de los parametros que vienen indicados con ?
  moviesRouter.get('/', movieController.getAllMovies)
  moviesRouter.post('/', movieController.create)
  moviesRouter.get('/pruebaBBDD', movieController.pruebaBBDD)
  //path-to-regex, valores que vienen informados en la url y el parametro se define en express

  moviesRouter.get('/:id', movieController.getById)
  moviesRouter.patch('/:id', movieController.update)
  moviesRouter.delete('/:id', movieController.delete)

  return moviesRouter
}
