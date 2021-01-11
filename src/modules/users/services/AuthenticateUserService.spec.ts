import AppError from '@/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

describe('AuthenticateUser', () => {
  it('should be able to authenticate user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )

    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await authenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
  })

  it('should not be able to authenticate user with non-existent email', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )

    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(
      authenticateUserService.execute({
        email: 'johndoe2@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate user with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )

    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(
      authenticateUserService.execute({
        email: 'johndoe@example.com',
        password: 'password',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
