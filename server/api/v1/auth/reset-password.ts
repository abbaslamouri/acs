import crypto from 'crypto'
import { ObjectId } from 'mongodb'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import { hashPassword } from '~/server/controllers/v1/auth'

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') throw new AppError('invalid request', 401)
    const body = await useBody(event)
    console.log('Body', body)
    const { password, resetToken } = body
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    const user = await mongoClient
      .db()
      .collection('users')
      .findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: new Date(Date.now()) } })
    console.log('US', user)
    if (!user) throw new AppError('Token is invlaid or has expired', 404)

    user.password = await hashPassword(password)
    user.passwordChangeDate = new Date(Date.now())
    delete user.passwordResetToken
    delete user.passwordResetExpires
    const updatedUser = await mongoClient
      .db()
      .collection('users')
      .replaceOne({ _id: new ObjectId(user._id) }, user)
    console.log('USMOD', updatedUser)
    if (!updatedUser) throw new AppError('We cannot update document', 404)
    return true
  } catch (err) {
    errorHandler(event, err)
  }
})
