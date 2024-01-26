const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto') //para generar UUID v4
const { validateMovie, validatePartialMovie } = require('./schema/movies')
const path = require('node:path')
const cors = require('cors')

const app = express()
app.disable('x-powered-by') // por temas de seguridad es importante deshabilitarlo.
const PORT = process.env.PORT ?? 1234

//Para controlar los origenes, podemos hacer un array de origenes y ver si el origen esta dentro
const ORIGENES_ACCEPTED = ['http://localhost:55656', 'http://localhost:4555', 'http://localhost:XXXX']

//app.use(express.json())

//Propia libreria de NodeJS para hacer un middleware, pero es un middleware qeu permite acceso a todos los origin *
//Tambien para el OPTION de los metodos complejos
//app.use(cors()) --> Para aceptar todo con un *
app.use(
  cors({
    origin: (origin, callback) => {
      const ORIGENES_ACCEPTED = ['http://localhost:55656', 'http://localhost:4555', 'http://localhost:XXXX']
      if (ORIGENES_ACCEPTED.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
  })
)

//CORS para metodos normales: GET/HEAD/POST
//Metodos complejos: PUT/PATCH/DELETE -- Para que estos metodos de la API tengan CORS hay que crear un nuevo evento
//Es el metodo OPTION que se peticiona desde el navegador antes de realizar la peticion de los metodo complejos y es
//la que informa al navegador si tiene o no CORS ese origen

/*app.use((req, res, next) => {
  console.log('Middleware para CORS')
  //Recuperamos el origen del cliente
  const origen = req.header('origin')
  console.log(origen)
  //El navegador nunca envia la cabecera de origin, si la peticion es del mismo origin
  if (ORIGENES_ACCEPTED.includes(origen)) {
    //Para evitar el problema de CORS, si ponemos * aceptamos todos los origenes
    res.header('Access-Control-Allow-Origin', origen)
  }
  next()
})*/

app.options((req, res) => {
  const origen = req.header('origin')
  console.log(origen)
  //El navegador nunca envia la cabecera de origin, si la peticion es del mismo origin
  if (ORIGENES_ACCEPTED.includes(origen)) {
    //Para evitar el problema de CORS, si ponemos * aceptamos todos los origenes
    res.header('Access-Control-Allow-Origin', origen)
    //metodos que puede utilizar el origen
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH')
  }
})

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')))

// Ruta para manejar el método GET en '/origen'
app.get('/origen', (req, res) => {
  // Utiliza res.sendFile para enviar el archivo index.html
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

//Todos los recursos se identifican con una URL, por lo que todo lo que se requiera de las MOVIES se identifica con /movies
//queryParam, los valores de los parametros que vienen indicados con ?
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filtermovies = movies.filter((movie) => movie.genre.toLowerCase() == genre.toLowerCase())
    return res.json(filtermovies)
  }
  res.json(movies)
})

//path-to-regex, valores que vienen informados en la url y el parametro se define en express
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find((movie) => movie.id == id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Error 404: Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: result.error.message }) //Error 400: Bad Request, el cliente ha hecho mal para la peticion
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: result.error.message }) //Error 400: Bad Request, el cliente ha hecho mal para la peticion
  }

  const movieIndex = movies.findIndex((movie) => movie.id == id)
  if (movieIndex == -1) return res.status(404).json({ message: 'Error 404: Movie not found' })
  const updateMovie = { ...movies[movieIndex], ...result.data }
  console.log(updateMovie)
  movies.splice(movieIndex, 1, updateMovie)
  //movies[movieIndex] = updateMovie
  res.status(201).json(updateMovie)
})

app.listen(PORT, () => {
  console.log(`Server listening port => http://localhost:${PORT}`)
})
