import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderDaysInMonthAvailabilityService from '@/appointments/services/ListProviderDaysInMonthAvailabilityService'

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params
    const { month, year } = request.body

    const listProviderDaysInMonthAvailability = container.resolve(
      ListProviderDaysInMonthAvailabilityService
    )

    const availableDays = await listProviderDaysInMonthAvailability.execute({
      provider_id,
      month,
      year,
    })

    return response.json(availableDays)
  }
}
