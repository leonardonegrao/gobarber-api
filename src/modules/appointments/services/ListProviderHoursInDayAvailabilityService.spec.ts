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
      date: new Date(2020, 4, 21, 8, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 21, 10, 0, 0),
    })

    const availability = await listProviderHoursInDayAvailabilityService.execute(
      {
        provider_id: 'provider',
        year: 2020,
        month: 5,
        day: 21,
      }
    )

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ])
    )
  })
})
