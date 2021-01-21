import { Router } from 'express'

import ensureAuthenticated from '@/infra/http/middlewares/ensureAuthenticated'
import ProvidersController from '../controllers/ProvidersController'

const providersRouter = Router()
const providersController = new ProvidersController()

providersRouter.use(ensureAuthenticated)

providersRouter.post('/', providersController.index)

export default providersRouter
