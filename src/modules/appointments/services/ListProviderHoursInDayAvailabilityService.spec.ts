import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderHoursInDayAvailabilityService from './ListProviderHoursInDayAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderHoursInDayAvailabilityService: ListProviderHoursInDayAvailabilityService

describe('ListProviderDaysInMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderHoursInDayAvailabilityService = new ListProviderHoursInDayAvailabilityService(
      fakeAppointmentsRepository
    )
  })

  it('should be able to list the provider’s available days of the month', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime()
    })

    const availability = await listProviderHoursInDayAvailabilityService.execute(
      {
        provider_id: 'provider',
        year: 2020,
        month: 5,
        day: 20,
      }
    )

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ])
    )
  })
})
