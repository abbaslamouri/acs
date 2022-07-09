import AppError from '~/server/utils/AppError'
import mongoClient from '~~/server/utils/mongoClient'
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

const fetchAll = async (event: any) => {
  const query: any = useQuery(event)
  console.log('Query', query)

  const fieldsArr = query.fields ? query.fields.split(',') : []
  const fieldsObj = {}
  for (const prop in fieldsArr) {
    console.log(fieldsArr[prop])
    fieldsObj[fieldsArr[prop].trim()] = 1
  }

  // if(query.sort.startsWith("-")) sortObject= {}
  const sortArr = query.sort.split('-')
  console.log('SPLIT', sortArr)
  const sortObj = {}
  if (sortArr.length === 1) sortObj[sortArr[0]] = 1
  else sortObj[sortArr[1]] = -1

  const page = query.page && query.page * 1 >= 1 ? query.page * 1 : 1
  const limit = query.limit && query.limit * 1 >= 1 ? query.limit * 1 : 1000
  const skip = (page - 1) * limit

  try {
    let docs: any
    let cursor: any
    const totalCount = await mongoClient.db().collection('media').countDocuments()
    cursor = mongoClient.db().collection('media').find()
    if (fieldsObj) cursor = cursor.project({ ...fieldsObj })
    if (sortObj) cursor = cursor.sort(sortObj)
    cursor = cursor.skip(skip).limit(limit)

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

const fetchAllMedia = async (event: any) => {
  return fetchAll(event)
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
      // console.log('ARAAAA', Array.isArray(files.gallery))
      // console.log('FFFFFFF', files)

      const uploadedMedia = []
      if (!Array.isArray(files.gallery)) {
        if (files.gallery.size > 1 * 1024 * 1024) reject(new AppError('File size must be less than 1 MB', 400))
        if (
          !files.gallery.mimetype.includes('image') &&
          !files.gallery.mimetype.includes('pdf') &&
          !files.gallery.mimetype.includes('csv')
        )
          reject(new AppError('Only image, pdf and csv format allowed!', 400))
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
          if (files.gallery[prop].size > 1 * 1024 * 1024) reject(new AppError('File size must be less than 1 MB', 400))
          if (
            !files.gallery[prop].mimetype.includes('image') &&
            !files.gallery[prop].mimetype.includes('pdf') &&
            !files.gallery[prop].mimetype.includes('csv')
          )
            reject(new AppError('Only image, pdf and csv format allowed!', 400))
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
    let returnError = ''
    const createdMediaNames = []
    for (const prop in resolvedMedia) {
      const found = await mongoClient
        .db()
        .collection('media')
        .findOne({ originalFilename: resolvedMedia[prop].originalFilename })
      if (found) {
        console.log('FOUND')
        returnError += `${resolvedMedia[prop].originalFilename} already exists <br>`
      } else {
        const newMedia = await mongoClient.db().collection('media').insertOne(resolvedMedia[prop])
        console.log('NNNNN', newMedia)
        if (!newMedia || !newMedia.insertedId)
          returnError += `Unable to create ${resolvedMedia[prop].originalFilename} already exists <br>`
        else createdMediaNames.push(resolvedMedia[prop].name)
      }
    }
    // console.log('FFFFF', extname(file.originalFilename))

    // const media = {
    //   name: `${file.newFilename}${extname(file.originalFilename)}`,
    //   originalFilename: file.originalFilename,
    //   mimetype: file.mimetype,
    //   fileSize: file.size,
    //   filePath: `/uploads/${file.newFilename}${extname(file.originalFilename)}` || '/uploads/placeholder.png',
    // }
    // let found = {}
    // const savedMedia = await mongoClient.db().collection('media').insertMany(resolvedMedia)
    // console.log('SSSSSS', savedMedia)
    // if (savedMedia && savedMedia.insertedCount) {
    //   found = await mongoClient.db().collection('media').findOne({ _id: savedMedia.insertedId })
    //   // console.log('SSSSSS', found)
    // }
    console.log('1', createdMediaNames)
    for (const prop in resolvedMedia) {
      console.log('2', resolvedMedia[prop].name)
      if (createdMediaNames.includes(resolvedMedia[prop].name))
        fs.renameSync(resolvedMedia[prop].originalPath, `${uploadPath}${resolvedMedia[prop].name}`)
      // , async (uploadError) => {
      //   try {
      //     if (uploadError) throw new AppError(uploadError.message, 400)
      //     if (resolvedMedia[prop].size > 1 * 1024 * 1024) throw new AppError('File size must be less than 1 MB', 400)
      //     if (
      //       !resolvedMedia[prop].mimetype.includes('image') &&
      //       !resolvedMedia[prop].mimetype.includes('pdf') &&
      //       !resolvedMedia[prop].mimetype.includes('csv')
      //     )
      //       throw new AppError('Only image, pdf and csv format allowed!', 400)
      //     console.log('ALL is good')
      //   } catch (err) {
      //     errorHandler(event, err)
      //   }
      // })
    }
    if (returnError) return { info: returnError }
    return true

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

const deleteMedia = async (event: any) => {
  try {
    const body = await useBody(event)
    console.log('Body', body)
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
