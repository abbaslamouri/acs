import { ObjectId } from 'mongodb'
import { setAuthCookie } from '~/server/controllers/v1/auth'
import jwt from 'jsonwebtoken'
import { getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') throw new AppError('invalid request', 401)
    const body = await useBody(event)
    console.log('Body', body)
    const { email, signupToken } = body
    const decoded: any = jwt.verify(signupToken, config.jwtSecret)
    console.log('DECODED', decoded)
    console.log(config.jwtSecret, decoded)
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
    if (user.email !== email)
      throw new AppError('We were not able to vefify your email, please contact customer serveice at 555-555-5555', 404)

    const verified = await mongoClient
      .db()
      .collection('users')
      .updateOne(
        {
          _id: new ObjectId(user._id),
        },
        { $set: { verified: true } }
      )
    console.log('verified', verified)
    if (!verified || !verified.modifiedCount)
      throw new AppError(
        'We were not able to update your records, please contact customer serveice at 555-555-5555',
        404
      )
    const token = await getSinedJwtToken(user._id, Number(config.jwtMaxAge) * 24 * 60 * 60)
    console.log(token)
     setAuthCookie(event, 'jwt', token, Number(config.jwtMaxAge) * 24 * 60 * 60)
    setAuthCookie(event, 'userName', user.name, Number(config.jwtMaxAge) * 24 * 60 * 60)
    return {
      userName: user.name,
    }
  } catch (err) {
    errorHandler(event, err)
  }
})
