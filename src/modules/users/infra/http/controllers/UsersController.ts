import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateUserService from '@/users/services/CreateUserService'
import UpdateUserAvatarService from '@/users/services/UpdateUserAvatarService'

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body

    const createUser = container.resolve(CreateUserService)
    const user = await createUser.execute({ name, email, password })

    return response.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    })
  }

  public async updateAvatar(
    request: Request,
    response: Response
  ): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService)

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    })
    return response.json({ user })
  }
}
