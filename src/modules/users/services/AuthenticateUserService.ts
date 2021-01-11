import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'

import User from '@/users/infra/typeorm/entities/User'
import authConfig from '@/config/auth'
import AppError from '@/errors/AppError'

import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

interface IUserWithoutPassword {
  id: string
  name: string
  email: string
  password?: string
}

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: IUserWithoutPassword
  token: string
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.findUser(email)
    await this.comparePassword(password, user.password)

    const token = this.generateToken(user.id)
    const safeToReturnUser = this.removeSensitiveDataOfUser(user)

    return { user: safeToReturnUser, token }
  }

  private async findUser(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    return user
  }

  private async comparePassword(
    clientPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const passwordMatched = await this.hashProvider.compareHash(
      clientPassword,
      hashedPassword
    )

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401)
    }
  }

  private generateToken(userId: string) {
    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: userId,
      expiresIn,
    })

    return token
  }

  private removeSensitiveDataOfUser(user: User): IUserWithoutPassword {
    const userWithoutPassword: IUserWithoutPassword = user
    delete userWithoutPassword.password

    return userWithoutPassword
  }
}
