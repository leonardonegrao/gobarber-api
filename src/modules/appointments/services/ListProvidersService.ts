import { injectable, inject } from 'tsyringe'

import IUsersRepository from '@/users/repositories/IUsersRepository'

import User from '@/users/infra/typeorm/entities/User'

interface IRequest {
  user_id: string
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders(user_id)

    return users
  }
}
