import { Router } from 'express'
import appointmentsRouter from '@/appointments/routes/appointments.routes'
import usersRoutes from '@/users/routes/user.routes'
import sessionsRoutes from '@/sessions/routes/sessions.routes'

const routes = Router()

routes.use('/appointments', appointmentsRouter)
routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)

export default routes
