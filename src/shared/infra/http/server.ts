import 'reflect-metadata'
import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errors } from 'celebrate'
import routes from './routes'
import uploadConfig from '@/config/upload'

import '../typeorm'
import '../../container'
import AppError from '@/errors/AppError'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(routes)
app.use(errors)
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  console.error(err)

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
})

app.listen(3333, () => {
  console.log('🚀 Server running on port 3333!')
})
