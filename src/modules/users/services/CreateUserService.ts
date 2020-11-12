import { hash } from 'bcryptjs'
import { getRepository, Repository } from 'typeorm'
import User from '@/users/models/User'

interface Request {
  name: string
  email: string
  password: string
}

export default class CreateUserService {
  readonly usersRepository: Repository<User>

  constructor() {
    this.usersRepository = getRepository(User)
  }

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkUserExists = await this.usersRepository.findOne({
      where: { email },
    })

    if (checkUserExists) {
      throw new Error('Email address already used')
    }

    const hashedPassword = await hash(password, 8)

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.usersRepository.save(user)

    return user
  }
}
