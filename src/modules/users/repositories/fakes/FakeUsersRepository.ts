import { v4 as uuid } from 'uuid'
import IUsersRepository from '@/users/repositories/IUsersRepository'
import ICreateUserDTO from '@/users/dtos/ICreateUserDTO'

import User from '@/users/infra/typeorm/entities/User'

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User()

    Object.assign(user, { id: uuid(), name, email, password })

    this.users.push(user)

    return user
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      usersUser => usersUser.id === user.id
    )

    this.users[findIndex] = user

    return user
  }

  public async findAllProviders(exclude_user_id: string): Promise<User[]> {
    let users = this.users

    if (exclude_user_id) {
      users = this.users.filter(user => user.id !== exclude_user_id)
    }

    return users
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id)

    return user
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email)

    return user
  }
}

export default FakeUsersRepository
