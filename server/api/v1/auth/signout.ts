import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import sendEmail from '~/server/utils/Email'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') return
    // const body = await useBody(event)
    // console.log('Body', body)
    const jwtToken = useCookie(event, 'jwt') || ''
    const userName = useCookie(event, 'userName') || ''

    // await setAuthCookies(event, user, jwt)
    console.log('Bo', jwtToken, userName)
    const decoded: any = jwt.verify(jwtToken, config.jwtSecret)
    console.log('DECODED', decoded)
    // console.log(config.jwtSecret, decoded)
    const user = await mongoClient
      .db()
      .collection('users')
      .findOne({
        _id: new ObjectId(decoded.id),
      })
    console.log('US', user)
    if (!user)
      throw new AppError(
        'We were not able to find your email in our database, please contact customer serveice at 555-555-5555',
        404
      )
    if (!user.name === userName)
      throw new AppError('We were not able to vefify your email, please contact customer serveice at 555-555-5555', 404)

    const cookieOptions = {
      maxAge: 1,
      httpOnly: true,
      secure: true,
    }
    setCookie(event, 'jwt', '', cookieOptions)
    setCookie(event, 'userName', '', cookieOptions)
    // event.statusCode = 200
    return true
  } catch (err) {
    errorHandler(event, err)
  }
})
