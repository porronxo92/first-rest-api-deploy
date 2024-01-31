import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'url'

/* ACTUALMENTE RECOMENDADO AHORA EN ESMODULES6 
ASI SE LEE/ESCRIBE EN ARCHIVOS LOCALES DEL PROYECTO*/
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)
export const readPathPublic = () => path.join(__dirname, 'public')
export const joinPath = (...paths) => path.join(...paths)
