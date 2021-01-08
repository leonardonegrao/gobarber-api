import { Router } from 'express'
import appointmentsRouter from '@/appointments/infra/http/routes/appointments.routes'
import usersRoutes from '@/users/infra/http/routes/user.routes'
import sessionsRoutes from '@/users/infra/http/routes/sessions.routes'

const routes = Router()

routes.use('/appointments', appointmentsRouter)
routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)

export default routes
