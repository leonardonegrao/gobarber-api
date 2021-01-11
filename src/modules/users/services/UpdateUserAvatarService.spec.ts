import AppError from '@/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeStorageProvider from '../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import UpdateUserAvatarService from './UpdateUserAvatarService'

describe('UpdateUserAvatar', () => {
  it('should be able to add avatar of existent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    })

    expect(user.avatar).toBe('avatar.jpg')
  })

  it('should not be able to update avatar of inexistent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    expect(
      updateUserAvatarService.execute({
        user_id: 'non existent user',
        avatarFileName: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to replace avatar of existent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    })

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
  })
})
