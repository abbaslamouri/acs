import fs from 'fs'
import slugify from 'slugify'
import formidable from 'formidable'
import AppError from '~/server/utils/AppError'
import errorHandler from '~/server/utils/errorHandler'

import mongoClient from '~/mongo'
import { AnyError, ObjectId } from 'mongodb'

import path from 'path'
import { fileURLToPath } from 'url'
import { extname } from 'path'

import { parse } from 'csv-parse'
// import mongoose from 'mongoose'
// import { Request, Response, NextFunction } from 'express'
// import APIFeatures from '../../utils/apiFeatures'
// import asyncHandler from '../../utils/asyncHandler'
// import { Product } from '../../models/product'
// import { Media } from '../../models/media'
// import { Eligibility } from '../../models/eligibility'
// import { Nexthigherassembly } from '../../models/nexthigherassembly'
// import { Oem, IOem } from '../../models/oem'
// import { Oempartnumber, IOempartnumber } from '../../models/oempartnumber'

const runtimeFile = fileURLToPath(new URL('./runtime', import.meta.url))
const runtimeDir = path.dirname(`${runtimeFile}`)
const uploadPath = `${path.join(runtimeDir, '../../public')}/uploads/`

const setProductAuthor = () => {
  // if ((req as any).user) req.body.createdBy = (req as any).user.id
  // next()
}

// const searchAll = async (req: Request, res: Response, next: NextFunction) => {
// 	interface IQueryParams {
// 		_id?: any
// 		eligibilities?: any
// 		nextHigherAssemblies?: any
// 		oem?: any
// 		oemPartNumber?: any
// 	}
// 	let docs: any[] = []
// 	// const indexes = await Model.cleanIndexes()
// 	// Eligibility.collection.drop()
// 	// console.log('XXXXX', indexes)
// 	// console.log('XXXXX', indexes)
// 	// console.log('REqPARAMS', req.query)
// 	const queryParams: IQueryParams = {}
// 	if (req.query.acsPartNumber) {
// 		docs = await Product.find({ _id: req.query.acsPartNumber })
// 	} else if (req.query.oemPartNumber) {
// 		docs = await Product.find({ oemPartNumber: req.query.oemPartNumber })
// 		// } else if (req.query.oem) {
// 		// 	docs = await Product.find({ oemPartNumber: { parent: req.query.oem } })
// 		// 	console.log(docs)
// 	} else {
// 		// console.log('LLLLLLL')
// 		if (req.query.eligibilities) queryParams.eligibilities = req.query.eligibilities
// 		if (req.query.nextHigherAssemblies) queryParams.nextHigherAssemblies = req.query.nextHigherAssemblies
// 		if (req.query.oem) queryParams.oem = req.query.oem
// 		docs = await Product.find(queryParams)
// 	}
// 	// if (req.query.oem) {
// 	// 	queryParams.oemPartNumber = { parent: req.query.oem }
// 	// 	// queryParams.oemPartNumber.parent = req.query.oem
// 	// }
// 	console.log('QQ', queryParams)
// 	// // if (req.query.nextHigherAssemblies) queryParams.nextHigherAssemblies = req.query.nextHigherAssemblies
// 	// console.log(queryParams)
// 	// // const totalCount = await Product.countDocuments()
// 	// // const docs = await features.query.explain()
// 	res.status(200).json({
// 		status: 'succes',
// 		// totalCount,
// 		results: docs.length,
// 		docs,
// 	})
// }

const createSubModels = async (dbTable: any, atrributes: any) => {
  if (!atrributes) return
  const attributeIds = []
  const AttributesArr = [...atrributes.split('|')]
  if (!AttributesArr.length) return
  for (const prop in AttributesArr) {
    // AttributesArr[prop] = AttributesArr[prop].trim()
    const attributeName = AttributesArr[prop].trim()
    const attributeSlug = slugify(attributeName, { lower: true })
    const found = await mongoClient.db().collection(dbTable).findOne({ name })
    // const found = await Model.find({ name: AttributesArr[prop] })
    if (found.length) {
      attributeIds.push(found._id)
    } else {
      const attr = await mongoClient.db().collection(dbTable).insertOne({ name: attributeName, slug: attributeSlug })
      if (attr && attr.insertedId) attributeIds.push(attr.insertedId)
      // const attribute = await Model.create({ name: AttributesArr[prop] })
      // if (attribute) product[dbTable].push(attribute.id)
    }
  }
  console.log('ARRTRRTT', attributeIds)

  return attributeIds
}

const createProducts = async (data: any, resolvedMedia: any, event: any) => {
  let found: any
  // console.log('data', data)
  // console.log('GGGGGGGGGGGG')
  // try {
  //   found = await mongoClient.db().collection('oems').find().toArray()
  //   console.log('FOUNDOEM')
  //   return
  // } catch (err) {
  //   console.log('RRRRRRRR', err)
  // }

  await Promise.all(
    data.map(async (item: any) => {
      let product = { ...item }
      product.name = item.acsPartNumber
      // product.eligibilities = []
      // product.nextHigherAssemblies = []
      product.price = product.price * 1
      product.tbq = item.tbq ? true : false
      console.log('PRODUCT', product)
      //     product.createdBy = (req as any).user.id
      let oem: any = {}
      const oemName = item.oem.trim()
      const oemSlug = slugify(oemName, { lower: true })
      found = await mongoClient.db().collection('oems').findOne({ name: oemName })
      if (found) {
        oem = found
        product.oem = oem._id
      } else {
        oem = await mongoClient.db().collection('oems').insertOne({ name: oemName, slug: oemSlug })
        if (oem && oem.insertedId) product.oem = oem.insertedId
      }
      console.log('oem', oem)

      let oemPartNumber: any = {}
      const oemPartNumberName = item.oemPartNumber.trim()
      const oemPartNumberSlug = slugify(oemPartNumberName, { lower: true })
      found = await mongoClient.db().collection('oempartnumbers').findOne({ name: oemPartNumberName })
      if (found) {
        product.oemPartNumber = found._id
      } else {
        oemPartNumber = await mongoClient
          .db()
          .collection('oempartnumbers')
          .insertOne({ name: oemPartNumberName, slug: oemPartNumberSlug, oem: oem._id })
        if (oemPartNumber && oemPartNumber.insertedId) product.oemPartNumber = oemPartNumber.insertedId
      }
      console.log('oemPartNumber', oemPartNumber)

      const image = await mongoClient
        .db()
        .collection('media')
        .findOne({ originalFilename: `${product.productImage}.jpg` })
      // console.log('IMG', image)
      if (image) product.gallery = [image._id]

      const eligibilities = await createSubModels('eligibilities', product.eligibilities)

      console.log('Product', product)

      // await Media.find({ originalName: `${data[prop].productImage}.jpg` })

      // found = await oemPartNumber.find({ name: data[prop].oemPartNumber.trim() })
      // if (!found.length) {
      //   oemPartNumber = await oemPartNumber.create({ name: data[prop].oemPartNumber.trim(), parent: oem.id })
      // } else {
      //   oemPartNumber = found[0]
      // }
      // product.oemPartNumber = oemPartNumber.id
    })
  )

  fs.rename(resolvedMedia.originalPath, `${uploadPath}${resolvedMedia.name}`, async (uploadError) => {
    try {
      if (uploadError) throw new AppError(uploadError.message, 400)
      if (resolvedMedia.size > 1 * 1024 * 1024) throw new AppError('File size must be less than 1 MB', 400)
      if (!resolvedMedia.mimetype.includes('csv')) throw new AppError('Only csv format allowed!', 400)
      console.log('ALL is good')
    } catch (err) {
      errorHandler(event, err)
    }
  })

  // for (const prop in data) {
  // let product = { ...data[prop] }
  // product.name = data[prop].acsPartNumber
  // product.gallery = []
  // product.eligibilities = []
  // product.nextHigherAssemblies = []
  // product.price = product.price * 1
  // product.tbq = data[prop].tbq ? true : false
  // console.log('PRODUCTxxxx', product)
  // //     product.createdBy = (req as any).user.id
  // let oem: any
  // found = await mongoClient.db().collection('oems').findOne({ name: data[prop].oem.trim() })
  // console.log('FOUNDOEM', found)
  // if (!found.length) {
  // 	// oem = await Oem.create({ name: data[prop].oem.trim() })
  // } else {
  // 	// oem = found[0]
  // }
  //     product.oem = oem.id
  //     let oemPartNumber: IOempartnumber
  //     found = await Oempartnumber.find({ name: data[prop].oemPartNumber.trim() })
  //     if (!found.length) {
  //       oemPartNumber = await Oempartnumber.create({ name: data[prop].oemPartNumber.trim(), parent: oem.id })
  //     } else {
  //       oemPartNumber = found[0]
  //     }
  //     product.oemPartNumber = oemPartNumber.id
  //     product.oem = oem.id
  //     const image = await Media.find({ originalName: `${data[prop].productImage}.jpg` })
  //     if (image.length) product.gallery.push(image[0].id)
  //     product = await createSubModels(product, 'eligibilities', Eligibility, data[prop].eligibilities)
  //     product = await createSubModels(
  //       product,
  //       'nextHigherAssemblies',
  //       Nexthigherassembly,
  //       data[prop].nextHigherAssemblies
  //     )
  //     console.log(product)
  //     await Product.create(product)
  // }
}

const seedProducts = async (event: any) => {
  console.log('FFFFFF')
  // console.log('LIST', await mongoClient.db().listCollections().toArray())
  let uploadPromise = new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(event.req, (err: any, fields: any, files: any) => {
      // console.log('ARAAAA', Array.isArray(files.gallery))
      // console.log('FFFFFFF', files)

      const uploadedMedia = {
        name: `${files.gallery.newFilename}${extname(files.gallery.originalFilename)}`,
        originalFilename: files.gallery.originalFilename,
        mimetype: files.gallery.mimetype,
        fileSize: files.gallery.size,
        originalPath: files.gallery.filepath,
        filePath:
          `/uploads/${files.gallery.newFilename}${extname(files.gallery.originalFilename)}` ||
          '/uploads/placeholder.png',
      }
      resolve(uploadedMedia)
    })
  })

  const resolvedMedia: any = await uploadPromise
  console.log('MMMMMMMMMedia', resolvedMedia)
  // console.log(uploadPath)

  // let found: any
  // // console.log('data', data)
  // console.log('GGGGGGGGGGGG')
  // try {
  //   found = await mongoClient.db().collection('oems').find().toArray()
  //   console.log('FOUNDOEM')
  //   return
  // } catch (err) {
  //   console.log('RRRRRRRR', err)
  // }

  const data: any[] = []
  fs.createReadStream(`${resolvedMedia.originalPath}`)
    .pipe(parse({ delimiter: ',', columns: true }))
    .on('data', function (row) {
      // console.log(row)
      data.push(row)
    })
    .on('end', async function () {
      // console.log('DDDDDDD', data)
      // const found = await mongoClient.db().collection('oems').find().toArray()
      // console.log('FOUNDOEM', found)
      await createProducts(data, resolvedMedia, event)
      return {
        status: 'succes',
      }
    })
    .on('error', function (error) {
      console.log(error.message)
    })

  console.log('DATA', data)

  // const db = mongoose.connection.db
  // const collections = await db.listCollections().toArray()
  // console.log('Collections', collections)
  // db.dropCollection('products')
  // db.dropCollection('eligibilities')
  // db.dropCollection('nexthigherassemblies')

  // return 'seeding'

  // const data: any[] = []
  // fs.createReadStream(`${__dirname}/../../../public/uploads/${(req as any).files[0].filename}`)
  //   .pipe(parse({ delimiter: ',', columns: true }))
  //   .on('data', function (row) {
  //     console.log(row)
  //     // data.push(row)
  //   })
  //   .on('end', async function () {
  //     // await createProducts(req, data)
  //     return {
  //       status: 'succes',
  //     }
  //   })
  //   .on('error', function (error) {
  //     console.log(error.message)
  //   })
}

export { setProductAuthor, seedProducts }

// import AppError from '~/server/utils/AppError'
// import mongoClient from '~/mongo'
// import { ObjectId } from 'mongodb'

// import errorHandler from '~/server/utils/errorHandler'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import { extname } from 'path'
// import { sendError, createError } from 'h3'
// import colors from 'colors'

// import fs from 'fs'
// import formidable from 'formidable'

// const runtimeFile = fileURLToPath(new URL('./runtime', import.meta.url))
// const runtimeDir = path.dirname(`${runtimeFile}`)
// const uploadPath = `${path.join(runtimeDir, '../../public')}/uploads/`

// const fetchAll = async (event: any) => {
//   const query: any = useQuery(event)
//   console.log('Query', query)

//   const fieldsArr = query.fields ? query.fields.split(',') : []
//   const fieldsObj = {}
//   for (const prop in fieldsArr) {
//     console.log(fieldsArr[prop])
//     fieldsObj[fieldsArr[prop].trim()] = 1
//   }

//   // if(query.sort.startsWith("-")) sortObject= {}
//   const sortArr = query.sort.split('-')
//   console.log('SPLIT', sortArr)
//   const sortObj = {}
//   if (sortArr.length === 1) sortObj[sortArr[0]] = 1
//   else sortObj[sortArr[1]] = -1

//   const page = query.page && query.page * 1 >= 1 ? query.page * 1 : 1
//   const limit = query.limit && query.limit * 1 >= 1 ? query.limit * 1 : 1000
//   const skip = (page - 1) * limit

//   try {
//     let docs: any
//     let cursor: any
//     const totalCount = await mongoClient.db().collection('products').countDocuments()
//     cursor = mongoClient.db().collection('products').find()
//     if (fieldsObj) cursor = cursor.project({ ...fieldsObj })
//     if (sortObj) cursor = cursor.sort(sortObj)
//     cursor = cursor.skip(skip).limit(limit)

//     docs = await cursor.toArray()

//     // const docs = await mongoClient.db().collection('products').find().toArray()
//     // const cursor = mongoClient.db().collection('products').find()
//     if (!docs) throw new AppError('We were not able to fetch product', 400)
//     return {
//       docs,
//       totalCount,
//       count: docs.length,
//     }
//   } catch (err) {
//     errorHandler(event, err)
//   }
// }

// const fetchAllProducts = async (event: any) => {
//   return fetchAll(event)
//   // try {
//   //   const totalCount = await mongoClient.db().collection('products').countDocuments()
//   //   const docs = await mongoClient.db().collection('products').find().toArray()
//   //   if (!docs) throw new AppError('We were not able to fetch media', 400)
//   //   return {
//   //     docs,
//   //     totalCount,
//   //     count: docs.length,
//   //   }
//   // } catch (err) {
//   //   errorHandler(event, err)
//   // }
// }

// const createProduct = async (event: any) => {
//   let uploadPromise = new Promise((resolve, reject) => {
//     const form = formidable({ multiples: true })
//     form.parse(event.req, (err: any, fields: any, files: any) => {
//       console.log('ARAAAA', Array.isArray(files.gallery))
//       console.log('FFFFFFF', files)

//       const uploadedMedia = []
//       if (!Array.isArray(files.gallery)) {
//         uploadedMedia[0] = {
//           name: `${files.gallery.newFilename}${extname(files.gallery.originalFilename)}`,
//           originalFilename: files.gallery.originalFilename,
//           mimetype: files.gallery.mimetype,
//           fileSize: files.gallery.size,
//           originalPath: files.gallery.filepath,
//           filePath:
//             `/uploads/${files.gallery.newFilename}${extname(files.gallery.originalFilename)}` ||
//             '/uploads/placeholder.png',
//         }
//       } else {
//         for (const prop in files.gallery) {
//           uploadedMedia[prop] = {
//             name: `${files.gallery[prop].newFilename}${extname(files.gallery[prop].originalFilename)}`,
//             originalFilename: files.gallery[prop].originalFilename,
//             mimetype: files.gallery[prop].mimetype,
//             fileSize: files.gallery[prop].size,
//             originalPath: files.gallery[prop].filepath,
//             filePath:
//               `/uploads/${files.gallery[prop].newFilename}${extname(files.gallery[prop].originalFilename)}` ||
//               '/uploads/placeholder.png',
//           }
//         }
//       }
//       resolve(uploadedMedia)
//     })
//   })

//   try {
//     const resolvedMedia: any = await uploadPromise
//     console.log('MMMMMMMMMedia', resolvedMedia)
//     // console.log('FFFFF', extname(file.originalFilename))

//     // const media = {
//     //   name: `${file.newFilename}${extname(file.originalFilename)}`,
//     //   originalFilename: file.originalFilename,
//     //   mimetype: file.mimetype,
//     //   fileSize: file.size,
//     //   filePath: `/uploads/${file.newFilename}${extname(file.originalFilename)}` || '/uploads/placeholder.png',
//     // }
//     let found = {}
//     const savedMedia = await mongoClient.db().collection('products').insertMany(resolvedMedia)
//     console.log('SSSSSS', savedMedia)
//     // if (savedMedia && savedMedia.insertedCount) {
//     //   found = await mongoClient.db().collection('products').findOne({ _id: savedMedia.insertedId })
//     //   // console.log('SSSSSS', found)
//     // }

//     for (const prop in resolvedMedia) {
//       fs.rename(resolvedMedia[prop].originalPath, `${uploadPath}${resolvedMedia[prop].name}`, async (uploadError) => {
//         try {
//           if (uploadError) throw new AppError(uploadError.message, 400)
//           if (resolvedMedia[prop].size > 1 * 1024 * 1024) throw new AppError('File size must be less than 1 MB', 400)
//           if (
//             !resolvedMedia[prop].mimetype.includes('image') &&
//             !resolvedMedia[prop].mimetype.includes('pdf') &&
//             !resolvedMedia[prop].mimetype.includes('csv')
//           )
//             throw new AppError('Only image, pdf and csv format allowed!', 400)
//           console.log('ALL is good')
//         } catch (err) {
//           errorHandler(event, err)
//         }
//       })
//     }

//     return fetchAll(event)

//     // return found

//     // console.log('DDDDDDD', data)
//     // await mongoClient.close()
//     // await mongoClient.connect()
//     // const savedMedia = await mongoClient.db().collection('products').insertOne(data)
//     // console.log('SSSSSS', savedMedia)
//     // await mongoClient.close()
//   } catch (err) {
//     errorHandler(event, err)
//   }
// }

// const deleteProduct = async (event: any) => {
//   try {
//     const body = await useBody(event)
//     console.log('Body', body)
//     // const doc = await mongoClient
//     //   .db()
//     //   .collection('products')
//     //   .findOne({ _id: new ObjectId(query.id) })
//     // if (!doc) throw new AppError(`We were not able to find media with id=${query.id}`, 400)

//     await Promise.all(
//       body.map(async (item: any) => {
//         const result = await mongoClient
//           .db()
//           .collection('products')
//           .deleteOne({ _id: new ObjectId(item._id) })
//         console.log('RESULTS', result)
//       })
//     )

//     await Promise.all(
//       body.map(async (item: any) => {
//         fs.unlink(`${uploadPath}${item.name}`, (err) => {
//           if (err) {
//             throw new AppError(`We were not able to unlink file ${item.name}`, 404)
//           }
//         })
//       })
//     )

//     // const deletedMedia = await mongoClient
//     //   .db()
//     //   .collection('products')
//     //   .deleteOne({ _id: new ObjectId(query.id) })
//     // console.log(deletedMedia)
//     // if (!deletedMedia || !deletedMedia.deletedCount) throw new AppError('We were not able to delete media', 400)

//     return true
//   } catch (err) {
//     errorHandler(event, err)
//   }
// }

// export { fetchAllProducts, createProduct, deleteProduct }
