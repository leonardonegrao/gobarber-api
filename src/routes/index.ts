import { Router } from 'express'
import appointmentsRouter from '@/appointments/routes/appointments.routes'

const routes = Router()

routes.use('/appointments', appointmentsRouter)

export default routes
