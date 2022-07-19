import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'

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

export { fetchUserById, createUser, hashPassword, checkPassword, getSinedJwtToken, setAuthCookies }
