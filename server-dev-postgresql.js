import { createApp } from './app.js'
import { MovieModel } from './models/database/postgresql/movie.js'

createApp({ movieModel: MovieModel })
