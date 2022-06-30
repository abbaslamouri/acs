import { sendError, createError } from 'h3'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/mongo'

const fetchAllUsers = async () => {
  try {
    const users = await mongoClient.db().collection('users').findOne({})
    return {
      users,
    }
  } catch (err) {
    console.log(err)
  }
}

const createUser = async (event: any) => {
  try {
    const body = await useBody(event)
    const user = await mongoClient.db().collection('users').insertOne(body)
    return {
      user,
    }
  } catch (err) {
    let message = 'Something went terribly wrong'
    let statusCode = 500

    if (err.code === 11000) {
      if (err.keyValue) {
        message = `${Object.values(err.keyValue)[0]} already exists. Please select a different ${
          Object.keys(err.keyValue)[0]
        }`
        statusCode = 400
      }
    }
    const error = new AppError(message, statusCode)
    return sendError(event, createError({ statusCode: error.statusCode, statusMessage: error.message, data: err }))
  }
}

export { fetchAllUsers, createUser }
