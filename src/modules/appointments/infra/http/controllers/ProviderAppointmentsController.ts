import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderAppointments from '@/appointments/services/ListProviderAppointmentsService'

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year } = request.body
    const provider_id = request.user.id

    const listProviderAppointments = container.resolve(ListProviderAppointments)

    const appointments = await listProviderAppointments.execute({
      provider_id,
      day,
      month,
      year,
    })

    return response.status(200).json(appointments)
  }
}
