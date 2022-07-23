import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'

const config = useRuntimeConfig()

const getSinedJwtToken = async function (id: any, maxAge: number) {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: maxAge })
}

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password as string, salt)
}

const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

const hasPasswordChanged = async function (JWTTimestamp: number, user: any) {
  if (user.passwordChangeDate) {
    return parseInt(user.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
  }
  return false
}

const setAuthCookie = (event: any, cookieName: string, cookieValue: string, maxAge: number) => {
  setCookie(event, cookieName, cookieValue, {
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  })
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

const getAuth = async (event: any) => {
  try {
    const jwtToken =
      event.req.headers &&
      event.req.headers.authorization &&
      (event.req.headers.authorization as String).startsWith('Bearer')
        ? (event.req.headers.authorization as String).split(' ')[1]
        : ''
    if (!jwtToken) throw new AppError('You are not allowed to access these resources, please login', 401)
    const decoded: any = jwt.verify(jwtToken, config.jwtSecret)
    const user = await mongoClient
      .db()
      .collection('users')
      .findOne({
        _id: new ObjectId(decoded.id),
      })
    if (!user) throw new AppError('We cannot find a user with this token in our database', 401)
    if (await hasPasswordChanged(decoded.iat, user))
      throw new AppError('User changed password recently, please login again', 401)
    return user
  } catch (err) {
    errorHandler(event, err)
  }
}

export { fetchUserById, createUser, hashPassword, checkPassword, getSinedJwtToken, setAuthCookie, getAuth }
