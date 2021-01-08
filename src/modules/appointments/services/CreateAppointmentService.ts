import { startOfHour } from 'date-fns'
import Appointment from '@/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@/appointments/repositories/IAppointmentsRepository'
import AppError from '@/errors/AppError'

interface IRequestDTO {
  date: Date
  provider_id: string
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({
    provider_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = await this.handleDate(date)

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    })

    return appointment
  }

  private async handleDate(date: Date): Promise<Date> {
    const appointmentDate = startOfHour(date)

    const findAppointmentWithSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    )

    if (findAppointmentWithSameDate) {
      throw new AppError('This time is already booked!')
    }

    return appointmentDate
  }
}

export default CreateAppointmentService
