import { hashPassword } from '~/server/controllers/v1/auth'
import { getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import sendEmail from '~/server/utils/Email'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (event.req.method !== 'POST') throw new AppError('invalid request', 401)
    const body = await useBody(event)
    const { user, url } = body
    const newUser = await mongoClient
      .db()
      .collection('users')
      .insertOne({
        name: user.name,
        email: user.email,
        password: await hashPassword(user.password),
        accountNumber: (await mongoClient.db().collection('users').countDocuments()) + 101013,
        signupDate: new Date(Date.now()),
        role: 'user',
        active: false,
        verified: false,
        passwordChangeDate: new Date(Date.now()),
      })
    if (!newUser || !newUser.insertedId) throw new AppError('Registration failed, please try again later', 404)
    const token = await getSinedJwtToken(newUser.insertedId, Number(config.jwtSignupTokenMaxAge) * 24 * 60 * 60)
    const emailHtml = `
    <p>Thank you for creating an account with ACS.</p>
    <p>Please click the link below to verify your account.</p>
    <p><a href='${url}?signupToken=${token}'>Click to confirm your email</a></p>
    <p>Can’t click the link? Copy and paste this link in your browser:</p>
    <p>${url}?signupToken=${token}</p>
    <p>Sincerely,<br>
    The ACS Team.</p>
    <p>You’re receiving this email because you recently created a new account with ACS. If this wasn’t you, please ignore this email.</p>
    `
    const emailText = `
    Thank you for creating an account with ACS.

    Please copy and paste the link below in your browser to verify your email.

    ${url}?signupToken=${token}

    Sincerely,
    The ACS Team.
    
    You’re receiving this email because you recently created a new account with ACS. If this wasn’t you, please ignore this email.
        `

    await new sendEmail({
      name: user.name,
      email: user.email,
      emailSubject: 'Please confirm your email address',
      emailText,
      emailHtml,
    }).sendRegisterationEmail()
    return true
  } catch (err) {
    errorHandler(event, err)
  }
})
