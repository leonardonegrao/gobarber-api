import FakeUsersRepository from '@/users/repositories/fakes/FakeUsersRepository'
import ListProvidersService from './ListProvidersService'

let fakeUsersRepository: FakeUsersRepository
let listProvidersService: ListProvidersService

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    listProvidersService = new ListProvidersService(fakeUsersRepository)
  })

  it('should be able to list providers without listing logged user', async () => {
    const firstProvider = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const secondProvider = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    })

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'johnsmith@example.com',
      password: '123456',
    })

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    })

    expect(providers).toEqual([firstProvider, secondProvider])
  })
})
