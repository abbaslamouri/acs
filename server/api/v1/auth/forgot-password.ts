import crypto from 'crypto'
import { ObjectId } from 'mongodb'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import sendEmail from '~/server/utils/Email'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') throw new AppError('invalid request', 401)
    const body = await useBody(event)
    console.log('Body', body)
    const { email, url } = body
    if (!email) throw new AppError('Please enter a valid email', 404)
    const user = await mongoClient.db().collection('users').findOne({ email })
    console.log('US', user)
    if (!user) throw new AppError('We cannot find user with this email in our database', 404)
    const resetToken = crypto.randomBytes(32).toString('hex')

    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.passwordResetExpires = new Date(Date.now() + config.pwResetTokenExpiresIn * 60 * 60 * 1000)
    const updatedUser = await mongoClient
      .db()
      .collection('users')
      .replaceOne({ _id: new ObjectId(user._id) }, user)
    console.log('US', updatedUser)
    if (!updatedUser) throw new AppError('We cannot update document', 404)
    const emailText = `
        Hello,
        Please copy the url below and paste it in your browser to reset your password.
        ${url}?resetToken=${resetToken}
        `
    const emailHtml = `
        <h3>Hello ${user.name},</h3>
        <p>Please click the link below to reset.</p>
        <p>${url}?resetToken=${resetToken}</p>
        `
    await new sendEmail({
      name: user.name,
      email: user.email,
      emailSubject: 'Your password reset token (valid for 1 hour)',
      emailText,
      emailHtml,
    }).sendPasswordResetEmail()
    return true
  } catch (err) {
    errorHandler(event, err)
  }
})
