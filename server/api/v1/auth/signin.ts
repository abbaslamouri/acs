import { getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import { checkPassword } from '~/server/controllers/v1/auth'
import { setAuthCookie } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') throw new AppError('invalid request', 401)
    const body = await useBody(event)
    const { email, password } = body
    if (!email || !password) throw new AppError('Email and Password are required', 404)
    const user = await mongoClient.db().collection('users').findOne({ email })
    if (!user || !(await checkPassword(password, user.password))) throw new AppError('Invalid email or password', 401)
    const token = await getSinedJwtToken(user._id, Number(config.jwtMaxAge) * 24 * 60 * 60)
    setAuthCookie(event, 'jwt', token, Number(config.jwtMaxAge) * 24 * 60 * 60)
    setAuthCookie(event, 'userName', user.name, Number(config.jwtMaxAge) * 24 * 60 * 60)
    return {
      userName: user.name,
    }
  } catch (err) {
    errorHandler(event, err)
  }
})
