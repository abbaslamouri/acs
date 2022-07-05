import AppError from '~/server/utils/AppError'
import mongoClient from '~/mongo'
import { ObjectId } from 'mongodb'

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
    const totalCount = await mongoClient.db().collection('media').countDocuments()
    const docs = await mongoClient.db().collection('media').find().toArray()
    if (!docs) throw new AppError('We were not able to fetch media', 400)
    return {
      docs,
      totalCount,
      count: docs.length,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const createMedia = async (event: any) => {
  let uploadPromise = new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })

    form.parse(event.req, (err: any, fields: any, files: any) => {
      resolve(files.gallery)
    })
  })

  try {
    const file: any = await uploadPromise
    // console.log('FFFFF', file.newFilename)
    // console.log('FFFFF', extname(file.originalFilename))
    const __filename = fileURLToPath(new URL('./runtime', import.meta.url))
    const runtimeDir = path.dirname(`${__filename}`)
    const uploadPath = `${path.join(runtimeDir, '../../public')}/uploads/`
    const media = {
      name: `${file.newFilename}${extname(file.originalFilename)}`,
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      fileSize: file.size,
      filePath: `/uploads/${file.newFilename}${extname(file.originalFilename)}` || '/uploads/placeholder.png',
    }
    let found = {}
    const savedMedia = await mongoClient.db().collection('media').insertOne(media)
    // console.log('SSSSSS', savedMedia)
    if (savedMedia && savedMedia.insertedId) {
      found = await mongoClient.db().collection('media').findOne({ _id: savedMedia.insertedId })
      // console.log('SSSSSS', found)
    }
    fs.rename(
      file.filepath,
      `${uploadPath}${file.newFilename}${extname(file.originalFilename)}`,
      async (uploadError) => {
        try {
          if (uploadError) throw new AppError(uploadError.message, 400)
          if (file.size > 1 * 1024 * 1024) throw new AppError('File size must be less than 1 MB', 400)
          if (!file.mimetype.includes('image') && !file.mimetype.includes('pdf') && !file.mimetype.includes('csv'))
            throw new AppError('Only image, pdf and csv format allowed!', 400)
          console.log('ALL is good')
        } catch (err) {
          errorHandler(event, err)
        }
      }
    )
    return found

    // console.log('DDDDDDD', data)
    // await mongoClient.close()
    // await mongoClient.connect()
    // const savedMedia = await mongoClient.db().collection('media').insertOne(data)
    // console.log('SSSSSS', savedMedia)
    // await mongoClient.close()
  } catch (err) {
    errorHandler(event, err)
  }
}

const deleteMedia = async (event: any, query: any) => {
  try {
    console.log('here', query)
    const { deletedCount } = await mongoClient
      .db()
      .collection('media')
      .deleteOne({ _id: new ObjectId(query.id) })
    if (!deletedCount) throw new AppError('We were not able to delete media', 400)
    return {
      deletedCount,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

export { fetchAllMedia, createMedia, deleteMedia }
