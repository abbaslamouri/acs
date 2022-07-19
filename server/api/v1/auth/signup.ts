import { hashPassword } from '~/server/controllers/v1/auth'
import { getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import sendEmail from '~/server/utils/Email'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') return
    const body = await useBody(event)
    console.log('Body', body)
    const { user, url, emailSubject } = body
    const newUser = await mongoClient
      .db()
      .collection('users')
      .insertOne({
        name: user.name,
        email: user.email,
        password: await hashPassword(user.password),
        role: 'user',
        active: false,
        verified: false,
        passwordChangeDate: new Date(Date.now()),
      })
    if (!newUser || !newUser.insertedId) throw new AppError('Registration failed, please try again later', 404)

    const token = await getSinedJwtToken(newUser.insertedId, Number(config.jwtSignupTokenMaxAge) * 24 * 60 * 60)

    const emailText = `
        Hello,
        Thank you for signing up on our site.
        Please copy the url below and paste it in your browser to verify your account.
        ${url}?signupToken=${token}
        `
    const emailHtml = `
        <h3>Hello ${user.name},</h3>
        <p>Thank you for signingup on our site.</p>
        <p>Please click the link below to verify your account.</p>
        <p>${url}?signupToken=${token}</p>
        `
    await new sendEmail({
      name: user.name,
      email: user.email,
      emailSubject,
      emailText,
      emailHtml,
    }).sendRegisterationEmail()
    return true
  } catch (err) {
    errorHandler(event, err)
  }
})
