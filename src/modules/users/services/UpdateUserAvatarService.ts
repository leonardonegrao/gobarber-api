import { injectable, inject } from 'tsyringe'

import User from '@/users/infra/typeorm/entities/User'
import AppError from '@/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository'
import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider'

interface IRequest {
  user_id: string
  avatarFileName: string
}

@injectable()
export default class AppUpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatars!', 401)
    }

    if (user.avatar) {
      this.storageProvider.deleteFile(user.avatar)
    }

    const filename = await this.storageProvider.saveFile(avatarFileName)

    user.avatar = filename

    await this.usersRepository.save(user)

    return user
  }
}
