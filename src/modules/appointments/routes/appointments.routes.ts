import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from '@/appointments/repositories/AppointmentsRepository'
import CreateAppointmentService from '@/appointments/services/CreateAppointmentService'
import ensureAuthenticated from '@/middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.get('/', async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find()

  return res.status(200).json(appointments)
})

appointmentsRouter.post('/', async (req, res) => {
  const { provider_id, date } = req.body
  const parsedDate = parseISO(date)
  const createAppointmentService = new CreateAppointmentService()

  const appointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  })

  return res.status(200).json(appointment)
})

export default appointmentsRouter
