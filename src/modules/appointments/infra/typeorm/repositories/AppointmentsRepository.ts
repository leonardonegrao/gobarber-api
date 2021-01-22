import { getRepository, Repository, Raw } from 'typeorm'

import IAppointmentsRepository from '@/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@/appointments/dtos/ICreateAppointmentDTO'
import IFindByMonthFromProviderDTO from '@/appointments/dtos/IFindByMonthFromProviderDTO'
import IFindByDayFromProviderDTO from '@/appointments/dtos/IFindByDayFromProviderDTO'

import Appointment from '@/appointments/infra/typeorm/entities/Appointment'

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date })

    await this.ormRepository.save(appointment)

    return appointment
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    })

    return findAppointment
  }

  public async findByMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindByMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0')

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = ${parsedMonth}-${year}`
        ),
      },
    })

    return appointments
  }

  public async findByDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindByDayFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0')
    const parsedDay = String(day).padStart(2, '0')

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = ${parsedDay}-${parsedMonth}-${year}`
        ),
      },
    })

    return appointments
  }
}

export default AppointmentsRepository
