import AppError from '@/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

describe('CreateAppointment', () => {
  it('should be able to create a new apppointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository
    )

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '1000',
    })

    expect(appointment).toHaveProperty('id')
  })

  it('should not be able to create two apppointments with same datetime', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository
    )

    const date = new Date(2021, 4, 10, 11)

    await createAppointmentService.execute({
      date,
      provider_id: '1000',
    })

    expect(
      createAppointmentService.execute({
        date,
        provider_id: '1000',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
