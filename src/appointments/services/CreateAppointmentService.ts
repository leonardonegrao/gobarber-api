import { startOfHour } from 'date-fns'
import Appointment from '@/appointments/models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'

interface RequestDTO {
  date: Date
  provider: string
}

class CreateAppointmentService {
  readonly appointmentsRepository: AppointmentsRepository

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository
  }

  public execute({ provider, date }: RequestDTO): Appointment {
    const appointmentDate = this.handleDate(date)

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    })

    return appointment
  }

  private handleDate(date: Date): Date {
    const appointmentDate = startOfHour(date)

    const findAppointmentWithSameDate = this.appointmentsRepository.findByDate(
      appointmentDate
    )

    if (findAppointmentWithSameDate) {
      throw Error('This time is already booked!')
    }

    return appointmentDate
  }
}

export default CreateAppointmentService
