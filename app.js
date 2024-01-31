import express, { json } from 'express'
import { joinPath, readPathPublic } from './utils.js'
import { CreateMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config.js'

export const createApp = ({ movieModel }) => {
  /* FORMA DE LEER UN JSON EN ESMODULES
import fs from 'node:fs'
const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))
*/
  const pathPublic = readPathPublic()

  const app = express()
  app.disable('x-powered-by') // por temas de seguridad es importante deshabilitarlo.
  const PORT = process.env.PORT ?? 1234
  //Actua como middleware para parsear todas las req.body a JSON en cada chunk
  app.use(json())
  //Middleware de CORS controlado en la clase cors.js
  app.use(corsMiddleware())

  //Le dice a express que todo lo que entre por /movies se redirija al archivo de ruta movies.js
  //y que se resuelva ahi para ese recurso

  app.use('/movies', CreateMovieRouter({ movieModel }))

  // Configura Express para servir archivos estáticos desde la carpeta 'public'
  app.use(express.static(pathPublic)) //Para decirle a express que cargue archivos en local de la carpeta /public

  // Ruta para manejar el método GET en '/origen'
  app.get('/origen', (req, res) => {
    // Utiliza res.sendFile para enviar el archivo index.html
    res.sendFile(joinPath(pathPublic, 'index.html'))
  })

  app.get('/', (req, res) => {
    res.json({ message: 'hola mundo' })
  })

  app.listen(PORT, () => {
    console.log(`Server listening port => http://localhost:${PORT}`)
  })
  return app
}
