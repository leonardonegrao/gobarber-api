import { Router } from 'express'
import appointmentsRouter from '@/appointments/infra/http/routes/appointments.routes'
import usersRouter from '@/users/infra/http/routes/users.routes'
import sessionsRouter from '@/users/infra/http/routes/sessions.routes'
import passwordRouter from '@/users/infra/http/routes/password.routes'
import profileRouter from '@/users/infra/http/routes/profile.routes'

const routes = Router()

routes.use('/appointments', appointmentsRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/password', passwordRouter)
routes.use('/profile', profileRouter)

export default routes
