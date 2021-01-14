import { Request, Response } from 'express'
import { container } from 'tsyringe'

import SendForgotPasswordEmailService from '@/users/services/SendForgotPasswordEmailService'
import ResetPasswordService from '@/users/services/ResetPasswordService'

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService
    )

    await sendForgotPasswordEmail.execute({
      email,
    })

    return response.status(204).json()
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { newPassword, token } = request.body

    const resetPassword = container.resolve(ResetPasswordService)

    await resetPassword.execute({
      newPassword,
      token,
    })

    return response.status(204).json()
  }
}
