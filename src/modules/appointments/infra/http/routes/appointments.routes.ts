import { Router } from 'express'

import ensureAuthenticated from '@/infra/http/middlewares/ensureAuthenticated'
import AppointmentsController from '../controllers/AppointmentsController'

const appointmentsRouter = Router()
const appointmentsController = new AppointmentsController()

appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.post('/', appointmentsController.create)

export default appointmentsRouter