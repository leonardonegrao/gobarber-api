import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ForgotPasswordController from '../controllers/ForgotPasswordController'

const passwordRouter = Router()
const forgotPasswordController = new ForgotPasswordController()

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create
)
passwordRouter.patch(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  forgotPasswordController.update
)

export default passwordRouter
