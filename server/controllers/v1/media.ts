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

const runtimeFile = fileURLToPath(new URL('./runtime', import.meta.url))
const runtimeDir = path.dirname(`${runtimeFile}`)
const uploadPath = `${path.join(runtimeDir, '../../public')}/uploads/`

const fetchAll = async (event: any, selectedFields: any = {}, sortObject: any = {}) => {
  console.log('SSSSS', selectedFields)
  console.log('RRRRRR', sortObject)

  try {
    let docs: any
    let cursor: any
    const totalCount = await mongoClient.db().collection('media').countDocuments()
    cursor = mongoClient.db().collection('media').find()
    if (selectedFields) cursor = cursor.project({ ...selectedFields })
    if (sortObject) cursor = cursor.sort(sortObject)

    docs = await cursor.toArray()

    // const docs = await mongoClient.db().collection('media').find().toArray()
    // const cursor = mongoClient.db().collection('media').find()
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

const fetchAllMedia = async (event: any, query: any) => {
  const selectedFields = {}
  const sortObject = {}
  const fields = query.fields.split(',')
  // if(query.sort.startsWith("-")) sortObject= {}

  for (const prop in fields) {
    console.log(fields[prop])
    selectedFields[fields[prop].trim()] = 1
  }

  console.log(query.sort.split('-'))
  const sorts = query.sort.split('-')
  if (sorts.length === 1) sortObject[sorts[0]] = 1
  else sortObject[sorts[1]] = -1
  return fetchAll(event, selectedFields, sortObject)
  // try {
  //   const totalCount = await mongoClient.db().collection('media').countDocuments()
  //   const docs = await mongoClient.db().collection('media').find().toArray()
  //   if (!docs) throw new AppError('We were not able to fetch media', 400)
  //   return {
  //     docs,
  //     totalCount,
  //     count: docs.length,
  //   }
  // } catch (err) {
  //   errorHandler(event, err)
  // }
}

const createMedia = async (event: any) => {
  let uploadPromise = new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(event.req, (err: any, fields: any, files: any) => {
      console.log('ARAAAA', Array.isArray(files.gallery))
      console.log('FFFFFFF', files)

      const uploadedMedia = []
      if (!Array.isArray(files.gallery)) {
        uploadedMedia[0] = {
          name: `${files.gallery.newFilename}${extname(files.gallery.originalFilename)}`,
          originalFilename: files.gallery.originalFilename,
          mimetype: files.gallery.mimetype,
          fileSize: files.gallery.size,
          originalPath: files.gallery.filepath,
          filePath:
            `/uploads/${files.gallery.newFilename}${extname(files.gallery.originalFilename)}` ||
            '/uploads/placeholder.png',
        }
      } else {
        for (const prop in files.gallery) {
          uploadedMedia[prop] = {
            name: `${files.gallery[prop].newFilename}${extname(files.gallery[prop].originalFilename)}`,
            originalFilename: files.gallery[prop].originalFilename,
            mimetype: files.gallery[prop].mimetype,
            fileSize: files.gallery[prop].size,
            originalPath: files.gallery[prop].filepath,
            filePath:
              `/uploads/${files.gallery[prop].newFilename}${extname(files.gallery[prop].originalFilename)}` ||
              '/uploads/placeholder.png',
          }
        }
      }
      resolve(uploadedMedia)
    })
  })

  try {
    const resolvedMedia: any = await uploadPromise
    console.log('MMMMMMMMMedia', resolvedMedia)
    // console.log('FFFFF', extname(file.originalFilename))

    // const media = {
    //   name: `${file.newFilename}${extname(file.originalFilename)}`,
    //   originalFilename: file.originalFilename,
    //   mimetype: file.mimetype,
    //   fileSize: file.size,
    //   filePath: `/uploads/${file.newFilename}${extname(file.originalFilename)}` || '/uploads/placeholder.png',
    // }
    let found = {}
    const savedMedia = await mongoClient.db().collection('media').insertMany(resolvedMedia)
    console.log('SSSSSS', savedMedia)
    // if (savedMedia && savedMedia.insertedCount) {
    //   found = await mongoClient.db().collection('media').findOne({ _id: savedMedia.insertedId })
    //   // console.log('SSSSSS', found)
    // }

    for (const prop in resolvedMedia) {
      fs.rename(resolvedMedia[prop].originalPath, `${uploadPath}${resolvedMedia[prop].name}`, async (uploadError) => {
        try {
          if (uploadError) throw new AppError(uploadError.message, 400)
          if (resolvedMedia[prop].size > 1 * 1024 * 1024) throw new AppError('File size must be less than 1 MB', 400)
          if (
            !resolvedMedia[prop].mimetype.includes('image') &&
            !resolvedMedia[prop].mimetype.includes('pdf') &&
            !resolvedMedia[prop].mimetype.includes('csv')
          )
            throw new AppError('Only image, pdf and csv format allowed!', 400)
          console.log('ALL is good')
        } catch (err) {
          errorHandler(event, err)
        }
      })
    }

    return fetchAll(event)

    // return found

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

const deleteMedia = async (event: any, body: any) => {
  try {
    // const doc = await mongoClient
    //   .db()
    //   .collection('media')
    //   .findOne({ _id: new ObjectId(query.id) })
    // if (!doc) throw new AppError(`We were not able to find media with id=${query.id}`, 400)

    await Promise.all(
      body.map(async (item: any) => {
        const result = await mongoClient
          .db()
          .collection('media')
          .deleteOne({ _id: new ObjectId(item._id) })
        console.log('RESULTS', result)
      })
    )

    await Promise.all(
      body.map(async (item: any) => {
        fs.unlink(`${uploadPath}${item.name}`, (err) => {
          if (err) {
            throw new AppError(`We were not able to unlink file ${item.name}`, 404)
          }
        })
      })
    )

    // const deletedMedia = await mongoClient
    //   .db()
    //   .collection('media')
    //   .deleteOne({ _id: new ObjectId(query.id) })
    // console.log(deletedMedia)
    // if (!deletedMedia || !deletedMedia.deletedCount) throw new AppError('We were not able to delete media', 400)

    return true
  } catch (err) {
    errorHandler(event, err)
  }
}

export { fetchAllMedia, createMedia, deleteMedia }
