import { getRepository, Repository } from 'typeorm'

import IUserTokensRepository from '@/users/repositories/IUserTokensRepository'

import UserToken from '@/users/infra/typeorm/entities/UserToken'

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>

  constructor() {
    this.ormRepository = getRepository(UserToken)
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findByToken = await this.ormRepository.findOne({
      where: { token },
    })

    return findByToken
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    })

    await this.ormRepository.save(userToken)

    return userToken
  }
}

export default UserTokensRepository
