import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from '@/appointments/repositories/AppointmentsRepository'
import CreateAppointmentService from '@/appointments/services/CreateAppointmentService'

const appointmentsRouter = Router()

appointmentsRouter.get('/', async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find()

  return res.status(200).json(appointments)
})

appointmentsRouter.post('/', async (req, res) => {
  try {
    const { provider, date } = req.body
    const parsedDate = parseISO(date)
    const createAppointmentService = new CreateAppointmentService()

    const appointment = await createAppointmentService.execute({
      provider,
      date: parsedDate,
    })

    return res.status(200).json(appointment)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

export default appointmentsRouter
