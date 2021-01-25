import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderHoursInDayAvailabilityService from '@/appointments/services/ListProviderHoursInDayAvailabilityService'

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params
    const { day, month, year } = request.body

    const listProviderHoursInDayAvailability = container.resolve(
      ListProviderHoursInDayAvailabilityService
    )

    const availableHours = await listProviderHoursInDayAvailability.execute({
      provider_id,
      day,
      month,
      year,
    })

    return response.json(availableHours)
  }
}
