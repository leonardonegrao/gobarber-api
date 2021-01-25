import { startOfHour, isBefore, getHours } from 'date-fns'
import { injectable, inject } from 'tsyringe'
import Appointment from '@/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@/appointments/repositories/IAppointmentsRepository'
import AppError from '@/errors/AppError'

interface IRequestDTO {
  date: Date
  provider_id: string
  user_id: string
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = await this.handleDate(date)

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself!")
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
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

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('This date has already passed!')
    }

    const firstHour = 8
    const lastHour = 17

    if (getHours(date) < firstHour || getHours(date) > lastHour) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm.'
      )
    }

    return appointmentDate
  }
}

export default CreateAppointmentService
