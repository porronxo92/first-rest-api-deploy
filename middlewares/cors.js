import cors from 'cors'

//Para controlar los origenes, podemos hacer un array de origenes y ver si el origen esta dentro
const ORIGENES_ACCEPTED = ['http://localhost:55656', 'http://localhost:4555', 'http://localhost:4432']

//Propia libreria de NodeJS para hacer un middleware, pero es un middleware qeu permite acceso a todos los origin *
//Tambien para el OPTION de los metodos complejos
//app.use(cors()) //--> Para aceptar todo con un *

//Middleware propio de express para el CORS pero con control de origenes con la matriz
export const corsMiddleware = ({ acceptedOrigins = ORIGENES_ACCEPTED } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
  })

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

//Esto se soluciona con la linea app.use(cors())
/*app.options((req, res) => {
  const origen = req.header('origin')
  console.log(origen)
  //El navegador nunca envia la cabecera de origin, si la peticion es del mismo origin
  if (ORIGENES_ACCEPTED.includes(origen)) {
    //Para evitar el problema de CORS, si ponemos * aceptamos todos los origenes
    res.header('Access-Control-Allow-Origin', origen)
    //metodos que puede utilizar el origen
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH')
  }
})*/
