import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { ObjectId } from 'mongodb'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import sendEmail from '~/server/utils/Email'
import { getAuth, checkPassword, hashPassword } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') throw new AppError('invalid request', 401)
    const body = await useBody(event)
    console.log('Body', body)
    const user = await getAuth(event)
    console.log(user)
    if (!user) throw new AppError('You must be logged in to change your password', 401)
    if (!(await checkPassword(body.currentPassword, user.password))) throw new AppError('Invalid current password', 401)
    const updatedUser = await mongoClient
      .db()
      .collection('users')
      .updateOne({ _id: new ObjectId(user._id) }, { $set: { password: await hashPassword(body.newPassword) } })
    console.log('US', updatedUser)
    if (!updatedUser || !updatedUser.modifiedCount) throw new AppError('We are not able to update your password', 401)
    return true

    // if (event.req.method !== 'GET') return
    // console.log('HEADERS', event.req.headers)
    // const jwtToken =
    //   event.req.headers &&
    //   event.req.headers.Authorization &&
    //   (event.req.headers.Authorization as String).startsWith('Bearer')
    //     ? (event.req.headers.Authorization as String).split(' ')[1]
    //     : ''
    // console.log(jwtToken)
    // if (!jwtToken) throw new AppError('You are not allowed to access these resources, please login', 401)

    // // const jwtToken = useCookie(event, 'jwt')
    // // const userName = useCookie(event, 'userName')
    // // await setAuthCookies(event, user, jwt)
    // // console.log('JWT', jwtToken, userName)
    // const decoded: any = jwt.verify(jwtToken, config.jwtSecret)
    // console.log('DECODED', decoded)
    // // console.log(config.jwtSecret, decoded)
    // const user = await mongoClient
    //   .db()
    //   .collection('users')
    //   .findOne({
    //     _id: new ObjectId(decoded.id),
    //   })
    // console.log('US', user)
    // if (!user)
    //   throw new AppError(
    //     'We cannot find a user with this token in our database',
    //     401
    //   )
    // if (!user.name === userName)
    //   throw new AppError('We were not able to vefify your email, please contact customer serveice at 555-555-5555', 404)
    // if (event.req.method !== 'GET') return
    // console.log('Body', body)
    // const { email, url, emailSubject } = body
    // if (!email) throw new AppError('Please enter a valid email', 404)
    // const user = await mongoClient.db().collection('users').findOne({ email })
    // console.log('US', user)
    // if (!user) throw new AppError('We cannot find user with this email in our database', 404)
    // const resetToken = crypto.randomBytes(32).toString('hex')
    // user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // user.passwordResetExpires = new Date(Date.now() + config.pwResetTokenExpiresIn * 60 * 60 * 1000)
    // const updatedUser = await mongoClient
    //   .db()
    //   .collection('users')
    //   .replaceOne({ _id: new ObjectId(user._id) }, user)
    // console.log('US', updatedUser)
    // if (!updatedUser) throw new AppError('We cannot update document', 404)
    // const emailText = `
    //     Hello,
    //     Please copy the url below and paste it in your browser to reset your password.
    //     ${url}?resetToken=${resetToken}
    //     `
    // const emailHtml = `
    //     <h3>Hello ${user.name},</h3>
    //     <p>Please click the link below to reset.</p>
    //     <p>${url}?resetToken=${resetToken}</p>
    //     `
    // await new sendEmail({
    //   name: user.name,
    //   email: user.email,
    //   emailSubject,
    //   // url: `${url}?token=${token}`,
    //   emailText,
    //   emailHtml,
    // }).sendPasswordResetEmail()
    // return 'user'
    // return true
  } catch (err) {
    errorHandler(event, err)
  }
})
