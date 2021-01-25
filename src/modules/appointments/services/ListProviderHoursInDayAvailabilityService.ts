import { injectable, inject } from 'tsyringe'
import { getHours, isAfter } from 'date-fns'

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

type IResponse = Array<{
  hour: number
  available: boolean
}>

@injectable()
export default class ListProviderHoursInDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findByDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      }
    )

    const firstHour = 8
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + firstHour
    )

    const currentDate = new Date(Date.now())

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour
      )

      const currentLoopDate = new Date(year, month - 1, day, hour)

      return {
        hour,
        available:
          !hasAppointmentInHour && isAfter(currentLoopDate, currentDate),
      }
    })

    return availability
  }
}
