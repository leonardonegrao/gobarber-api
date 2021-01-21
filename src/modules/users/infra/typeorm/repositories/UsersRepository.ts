import { getRepository, Repository, Not } from 'typeorm'

import IUsersRepository from '@/users/repositories/IUsersRepository'
import ICreateUserDTO from '@/users/dtos/ICreateUserDTO'

import User from '@/users/infra/typeorm/entities/User'

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User)
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password })

    await this.ormRepository.save(user)

    return user
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user)
  }

  public async findAllProviders(exclude_user_id: string): Promise<User[]> {
    let users: User[]

    if (exclude_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(exclude_user_id),
        },
      })
    } else {
      users = await this.ormRepository.find()
    }

    return users
  }

  public async findById(id: string): Promise<User | undefined> {
    const findById = await this.ormRepository.findOne({
      where: { id },
    })

    return findById
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findByEmail = await this.ormRepository.findOne({
      where: { email },
    })

    return findByEmail
  }
}

export default UsersRepository
