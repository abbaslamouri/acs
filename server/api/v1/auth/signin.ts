import { getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import { checkPassword } from '~/server/controllers/v1/auth'
import { setAuthCookies } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') return
    const body = await useBody(event)
    console.log('Body', body)
    const { email, password } = body
    if (!email || !password) throw new AppError('Email and Password are required', 404)
    const user = await mongoClient.db().collection('users').findOne({ email })
    console.log('US', user)
    if (!user || !(await checkPassword(password, user.password))) throw new AppError('Invalid email or password', 401)

    const token = await getSinedJwtToken(user._id, Number(config.jwtMaxAge) * 24 * 60 * 60)

    await setAuthCookies(event, user, token)
    return {
      userName: user.name,
    }
  } catch (err) {
    errorHandler(event, err)
  }
})
