import { Router } from 'express'
import multer from 'multer'

import uploadConfig from '@/config/upload'
import ensureAuthenticated from '@/infra/http/middlewares/ensureAuthenticated'
import UsersController from '../controllers/UsersController'

const usersRouter = Router()
const upload = multer(uploadConfig)
const usersController = new UsersController()

usersRouter.post('/', usersController.create)

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersController.updateAvatar
)

export default usersRouter
