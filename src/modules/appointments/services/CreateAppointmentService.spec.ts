import AppError from '@/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import FakeNotificationsRepository from '@/notifications/repositories/fakes/FakeNotificationsRepository'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeNotificationsRepository: FakeNotificationsRepository
let createAppointmentService: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository
    )
  })

  it('should be able to create a new apppointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '1000',
      user_id: '1001',
    })

    expect(appointment).toHaveProperty('id')
  })

  it('should not be able to create two apppointments with same datetime', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const date = new Date(2021, 4, 10, 13)

    await createAppointmentService.execute({
      date,
      provider_id: '1000',
      user_id: '1001',
    })

    await expect(
      createAppointmentService.execute({
        date,
        provider_id: '1000',
        user_id: '1001',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create appointments on passed dates', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider',
        user_id: 'user',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: 'provider',
        user_id: 'provider',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create appointment on non-working hours', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider',
        user_id: 'user',
      })
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: 'provider',
        user_id: 'user',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
