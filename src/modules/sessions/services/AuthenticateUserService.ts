import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { getRepository, Repository } from 'typeorm'
import User from '@/users/models/User'
import authConfig from '@/config/auth'
import AppError from '@/errors/AppError'

interface UserWithoutPassword {
  id: string
  name: string
  email: string
  password?: string
}

interface Request {
  email: string
  password: string
}

interface Response {
  user: UserWithoutPassword
  token: string
}

export default class AuthenticateUserService {
  readonly usersRepository: Repository<User>

  constructor() {
    this.usersRepository = getRepository(User)
  }

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.findUser(email)
    await this.comparePassword(password, user.password)

    const token = this.generateToken(user.id)
    const safeToReturnUser = this.removeSensitiveDataOfUser(user)

    return { user: safeToReturnUser, token }
  }

  private async findUser(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } })

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    return user
  }

  private async comparePassword(
    clientPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const passwordMatched = await compare(clientPassword, hashedPassword)

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

  private removeSensitiveDataOfUser(user: User): UserWithoutPassword {
    const userWithoutPassword: UserWithoutPassword = user
    delete userWithoutPassword.password

    return userWithoutPassword
  }
}
