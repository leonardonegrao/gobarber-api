import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@/config/upload'
import CreateUserService from '@/users/services/CreateUserService'
import UpdateUserAvatarService from '@/users/services/UpdateUserAvatarService'
import ensureAuthenticated from '@/infra/http/middlewares/ensureAuthenticated'

const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body

  const createUser = new CreateUserService()
  const user = await createUser.execute({ name, email, password })

  return res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      id: user.id,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  })
})

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateUserAvatar = new UpdateUserAvatarService()

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFileName: req.file.filename,
    })
    return res.json({ user })
  }
)

export default usersRouter
