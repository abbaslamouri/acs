import AppError from '~/server/utils/AppError'
import mongoClient from '~/mongo'
import errorHandler from '~/server/utils/errorHandler'
import path from 'path'
import { fileURLToPath } from 'url'
import { extname } from 'path'
import { sendError, createError } from 'h3'
import colors from 'colors'

import fs from 'fs'
import formidable from 'formidable'

const fetchAllMedia = async (event: any) => {
  try {
    const totalCount = await mongoClient.db().collection('users').countDocuments()
    const users = await mongoClient.db().collection('users').find().toArray()
    if (users) throw new AppError('We were not able to fetch users', 400)
    return {
      users,
      totalCount,
      count: users.length,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const fetchMediaById = async (event: any) => {
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

const createMedia = async (event: any) => {
  try {
    // await mongoClient.connect()
    const body = await useBody(event)
    console.log('BBBBBB', body)
    const savedMedia = await mongoClient.db().collection('media').insertOne(body)
    console.log('SSSSSS', savedMedia)
    if (!savedMedia || !savedMedia.insertedId) throw new AppError('We were not able to insert media into database', 404)
    const found = await mongoClient.db().collection('media').findOne({ _id: savedMedia.insertedId })
    return {
      media: found,
    }
  } catch (err) {
    console.error('ERR', err)
    errorHandler(event, err)
  }
  // const data =
  // const body = await useBody(event)
  // const user = { ...body, name: body.name.trim(), email: body.email.trim().toLowerCase() }
  // user.role = user.role || 'user'
  // const savedUser = await mongoClient.db().collection('users').insertOne(user)
  // if (!savedUser || !savedUser.insertedId) throw new AppError('We were not able to insert user into database', 404)
  // const found = await mongoClient.db().collection('users').findOne({ _id: savedUser.insertedId })
  // return {
  //   user: found,
  // }
}

export { fetchAllMedia, fetchMediaById, createMedia }
