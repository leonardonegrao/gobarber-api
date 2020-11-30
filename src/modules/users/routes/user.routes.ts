import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@/config/upload'
import CreateUserService from '@/users/services/CreateUserService'
import UpdateUserAvatarService from '@/users/services/UpdateUserAvatarService'
import ensureAuthenticated from '@/middlewares/ensureAuthenticated'

const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService()

      const user = await updateUserAvatar.execute({
        user_id: req.user.id,
        avatarFileName: req.file.filename,
      })
      return res.json({ user })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }
)

export default usersRouter
