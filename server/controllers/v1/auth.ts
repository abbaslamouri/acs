import cloneDeep from 'lodash.clonedeep'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import crypto from 'crypto'

import { ObjectId } from 'mongodb'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'
import sendEmail from '~/server/utils/Email'

const config = useRuntimeConfig()

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password as string, salt)
}

const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

const getSinedJwtToken = async function (id: any, maxAge: number) {
  // return await promisify(jwt.sign)({ id }, config.jwtSecret, { expiresIn: maxAge })
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: maxAge })
}

const setAuthCookies = async (event: any, user: any, token: string) => {
  const cookieOptions = {
    maxAge: Number(config.jwtMaxAge) * 24 * 60 * 60,
    // maxAge: 600,
    httpOnly: true,
    secure: true,
  }
  setCookie(event, 'jwt', token, cookieOptions)
  setCookie(event, 'userName', user.name, cookieOptions)
}

const signup = async (event: any, body: any) => {
  try {
    const { user, url, emailSubject } = body
    console.log('U', user)

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
        passwordChangeDate: new Date(),
      })
    if (!newUser || !newUser.insertedId) throw new AppError('Registration failed, please try again later', 404)

    const token = await getSinedJwtToken(newUser.insertedId, Number(config.jwtSignupTokenMaxAge) * 24 * 60 * 60)
    console.log('T', token)

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
}

const verifyEmail = async (event: any, body: any) => {
  try {
    console.log('RPT', body)

    const { email, signupToken } = body
    // const decoded = await promisify(jwt.verify)(signupToken, process.env.JWT_SECRET)
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
    if (!user.email === email)
      throw new AppError('We were not able to vefify your email, please contact customer serveice at 555-555-5555', 404)

    const token = await getSinedJwtToken(user._id, Number(config.jwtMaxAge) * 24 * 60 * 60)

    await setAuthCookies(event, user, token)

    // const user = await User.findById(decoded.id)
    // if (!user) return next(new AppError('We cannot find a user with this token in our database', 401))

    // const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    // const user = await User.findOne({
    //   passwordResetToken: hashedToken,
    //   passwordResetExpires: { $gt: Date.now() },
    // })
    // if (!user) return next(new AppError(`Your registration token is invlaid or has expired`, 400))
    // if (user.email !== userEmail.toLowerCase()) return next(new AppError(`Invalid email`, 400))
    // // user.password = req.body.password
    // user.passwordResetToken = undefined
    // user.passwordResetExpires = undefined
    // // user.active = true
    // user.verified = true
    // // console.log(user)
    // await user.save()
    // const url = `${process.env.BASE_URL}`
    // await new Email(user, url).sendWelcome()
    // return await sendTokenResponse(res, 200, user)
    return {
      userName: user.name,
      // token: token,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const signin = async (event: any, body: any) => {
  try {
    console.log('Bo', body)

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
}

const signout = async (event: any, body: any) => {
  try {
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
    event.statusCode = 200
    return true

    // const cookieOptions = {
    //   expires: new Date(Date.now() + 1000),
    //   httpOnly: true,
    // }

    // res.cookie('jwt', '', cookieOptions)

    // res.status(200).json({
    //   status: 'success',
    //   data: null,
    // })
  } catch (err) {
    errorHandler(event, err)
  }
}

const fetchUserById = async (event: any) => {
  try {
    const query = useQuery(event)
    console.log(query)
    const user = await mongoClient.db().collection('users').findOne({ _id: query.id })
    return {
      user,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const createUser = async (event: any) => {
  try {
    const body = await useBody(event)
    const user = { ...body, name: body.name.trim(), email: body.email.trim().toLowerCase() }
    user.role = user.role || 'user'
    const savedUser = await mongoClient.db().collection('users').insertOne(user)
    if (!savedUser || !savedUser.insertedId) throw new AppError('We were not able to insert user into database', 404)
    const found = await mongoClient.db().collection('users').findOne({ _id: savedUser.insertedId })
    return {
      user: found,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

export { signup, verifyEmail, signin, signout, fetchUserById, createUser }
