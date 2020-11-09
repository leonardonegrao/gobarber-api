import { Router } from 'express'
import { parseISO } from 'date-fns'
import AppointmentsRepository from '@/appointments/repositories/AppointmentsRepository'
import CreateAppointmentService from '@/appointments/services/CreateAppointmentService'

const appointmentsRouter = Router()

const appointmentsRepository = new AppointmentsRepository()

appointmentsRouter.get('/', (req, res) => {
  const appointments = appointmentsRepository.showAll()

  return res.status(200).json(appointments)
})

appointmentsRouter.post('/', (req, res) => {
  try {
    const { provider, date } = req.body

    const parsedDate = parseISO(date)
    const createAppointmentService = new CreateAppointmentService(
      appointmentsRepository
    )

    const appointment = createAppointmentService.execute({
      provider,
      date: parsedDate,
    })

    return res.status(200).json(appointment)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

export default appointmentsRouter
