import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import UpdateProfileService from '@/users/services/UpdateProfileService'
import ShowProfileService from '@/users/services/ShowProfileService'

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id
    const showProfile = container.resolve(ShowProfileService)

    const user = await showProfile.execute({ user_id })

    return response.json({ user: classToClass(user) })
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, old_password, password } = request.body
    const user_id = request.user.id

    const updateProfile = container.resolve(UpdateProfileService)
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    })

    return response.status(200).json({
      user: classToClass(user),
    })
  }
}
