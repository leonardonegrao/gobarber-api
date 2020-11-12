import { Router } from 'express'
import CreateUserService from '@/users/services/CreateUserService'

const usersRouter = Router()

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

export default usersRouter
