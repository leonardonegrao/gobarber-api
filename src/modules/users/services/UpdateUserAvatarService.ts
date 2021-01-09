import path from 'path'
import fs from 'fs'
import { injectable, inject } from 'tsyringe'

import uploadConfig from '@/config/upload'
import User from '@/users/infra/typeorm/entities/User'
import AppError from '@/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  user_id: string
  avatarFileName: string
}

@injectable()
export default class AppUpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatars!', 401)
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    user.avatar = avatarFileName

    await this.usersRepository.save(user)

    return user
  }
}
