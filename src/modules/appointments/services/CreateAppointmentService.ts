import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'
import Appointment from '@/appointments/models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'

interface RequestDTO {
  date: Date
  provider_id: string
}

class CreateAppointmentService {
  readonly appointmentsRepository: AppointmentsRepository

  constructor() {
    this.appointmentsRepository = getCustomRepository(AppointmentsRepository)
  }

  public async execute({
    provider_id,
    date,
  }: RequestDTO): Promise<Appointment> {
    const appointmentDate = await this.handleDate(date)

    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    })

    await this.appointmentsRepository.save(appointment)

    return appointment
  }

  private async handleDate(date: Date): Promise<Date> {
    const appointmentDate = startOfHour(date)

    const findAppointmentWithSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    )

    if (findAppointmentWithSameDate) {
      throw Error('This time is already booked!')
    }

    return appointmentDate
  }
}

export default CreateAppointmentService
