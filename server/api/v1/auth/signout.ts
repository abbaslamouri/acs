import AppError from '~/server/utils/AppError'
import errorHandler from '~/server/utils/errorHandler'
import { getAuth } from '~/server/controllers/v1/auth'
import { setAuthCookie } from '~/server/controllers/v1/auth'

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') throw new AppError('invalid request', 401)
    const user = await getAuth(event)
    if (user) {
      setAuthCookie(event, 'jwt', '', 1)
      setAuthCookie(event, 'userName', '', 1)
    }
    return true
  } catch (err) {
    errorHandler(event, err)
  }
})
