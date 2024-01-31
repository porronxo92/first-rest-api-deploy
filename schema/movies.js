import z from 'zod'

const movieSchema = z.object({
  //ZOD sirve para poder hacer comprobaciones de todos los campos que nos llegan en la request.body desde el cliente
  name: z.string({
    invalid_type_error: 'Mensaje si el tipo de dato es diferente a String',
    required_error: 'Error si el campo es requerido y no viene informado',
  }),
  release_year: z.number().int().positive().min(1900).max(2024), //validaciones para un numero, con los diferentes metodos de number podemos validar lo que queramos
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: 'URL not valid. Must be a valid URL',
  }),
  genre: z.array(z.enum(['drama', 'sci-fi', 'adventure', 'crime', 'musical', 'action']), {
    required_error: 'Movie genre is required',
  }),
})

export function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object)
}

export function validateMovie(object) {
  return movieSchema.safeParse(object)
}
