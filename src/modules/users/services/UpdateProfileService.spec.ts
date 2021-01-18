import AppError from '@/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfileService: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })

  it('should be able to update profile fields', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    })

    expect(updatedUser.name).toBe('Jane Doe')
    expect(updatedUser.email).toBe('janedoe@example.com')
  })

  it('should not be able to update email to one that already is registered', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123456',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      old_password: '123456',
      password: '123123',
    })

    expect(updatedUser.password).toBe('123123')
  })

  it('should not be able to update the password when previous password is not informed', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password when previous password is not correct', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        old_password: '123123',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update profile of non-existent user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existent user',
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
