import { Router } from 'express'
import { parseISO } from 'date-fns'
import AppointmentsRepository from '@/appointments/infra/typeorm/repositories/AppointmentsRepository'
import CreateAppointmentService from '@/appointments/services/CreateAppointmentService'
import ensureAuthenticated from '@/infra/http/middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAuthenticated)

// appointmentsRouter.get('/', async (req, res) => {
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository)
//   const appointments = await appointmentsRepository.find()

//   return res.status(200).json(appointments)
// })

appointmentsRouter.post('/', async (req, res) => {
  const appointmentsRepository = new AppointmentsRepository()

  const { provider_id, date } = req.body
  const parsedDate = parseISO(date)
  const createAppointmentService = new CreateAppointmentService(
    appointmentsRepository
  )

  const appointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  })

  return res.status(200).json(appointment)
})

export default appointmentsRouter
