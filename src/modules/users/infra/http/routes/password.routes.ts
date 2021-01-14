import { Router } from 'express'

import ForgotPasswordController from '../controllers/ForgotPasswordController'

const passwordRouter = Router()
const forgotPasswordController = new ForgotPasswordController()

passwordRouter.post('/forgot', forgotPasswordController.create)
passwordRouter.patch('/reset', forgotPasswordController.reset)

export default passwordRouter
