import { container } from 'tsyringe'

import '@/users/providers'
import './providers'

import IAppointmentsRepository from '@/appointments/repositories/IAppointmentsRepository'
import AppointmentsRepository from '@/appointments/infra/typeorm/repositories/AppointmentsRepository'

import IUsersRepository from '@/users/repositories/IUsersRepository'
import UsersRepository from '@/users/infra/typeorm/repositories/UsersRepository'

import IUserTokensRepository from '@/users/repositories/IUserTokensRepository'
import UserTokensRepository from '@/users/infra/typeorm/repositories/UserTokensRepository'

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
)

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository
)
