import { injectable, inject } from 'tsyringe'

import User from '@/users/infra/typeorm/entities/User'
import AppError from '@/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  user_id: string
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.')
    }

    return this.usersRepository.save(user)
  }
}
