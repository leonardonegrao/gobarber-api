import { Router } from 'express'
import multer from 'multer'
import { celebrate, Segments, Joi } from 'celebrate'

import uploadConfig from '@/config/upload'
import ensureAuthenticated from '@/infra/http/middlewares/ensureAuthenticated'
import UsersController from '../controllers/UsersController'

const usersRouter = Router()
const upload = multer(uploadConfig)
const usersController = new UsersController()

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
)

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersController.updateAvatar
)

export default usersRouter
