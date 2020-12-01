import path from 'path'
import fs from 'fs'
import { getRepository } from 'typeorm'
import uploadConfig from '@/config/upload'
import User from '@/users/models/User'
import AppError from '@/errors/AppError'

interface Request {
  user_id: string
  avatarFileName: string
}

export default class AppUpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne(user_id)

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

    await usersRepository.save(user)

    return user
  }
}
