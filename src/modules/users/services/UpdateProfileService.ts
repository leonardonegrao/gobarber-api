import { injectable, inject } from 'tsyringe'

import User from '@/users/infra/typeorm/entities/User'
import AppError from '@/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '@/users/providers/HashProvider/models/IHashProvider'

interface IRequest {
  user_id: string
  name: string
  email: string
  old_password?: string
  password?: string
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError(
        'Only authenticated users can update their profile!',
        401
      )
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      console.log(userWithUpdatedEmail)
      throw new AppError('This email is already being used.')
    }

    user.name = name
    user.email = email

    if (password && !old_password) {
      throw new AppError(
        'You need to inform your previous password to change it.'
      )
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      )

      if (!checkOldPassword) {
        throw new AppError('The old password informed is incorrect.')
      }

      user.password = await this.hashProvider.generateHash(password)
    }

    return this.usersRepository.save(user)
  }
}
