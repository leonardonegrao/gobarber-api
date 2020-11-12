import { compare } from 'bcryptjs'
import { getRepository, Repository } from 'typeorm'
import User from '@/users/models/User'

interface Request {
  email: string
  password: string
}

interface Response {
  user: User
}

export default class AuthenticateUserService {
  readonly usersRepository: Repository<User>

  constructor() {
    this.usersRepository = getRepository(User)
  }

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({ where: { email } })

    if (!user) {
      throw new Error('Email/password combination not found!')
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new Error('Email/password combination not found!')
    }

    return { user }
  }
}
