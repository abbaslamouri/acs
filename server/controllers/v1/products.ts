import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { extname } from 'path'
import { parse } from 'csv-parse'
import slugify from 'slugify'
import formidable from 'formidable'
import AppError from '~/server/utils/AppError'
import errorHandler from '~/server/utils/errorHandler'
import mongoClient from '~/server/utils/mongoClient'
import { ObjectId } from 'mongodb'
import { defaultSchema, productSchema } from '~/server/utils/mongoSchemas'

const runtimeFile = fileURLToPath(new URL('./runtime', import.meta.url))
const runtimeDir = path.dirname(`${runtimeFile}`)
const uploadPath = `${path.join(runtimeDir, '../../public')}/uploads/`

const createAttributesModels = async (dbTable: any, atrributes: any) => {
  if (!atrributes) return []
  const attributeIds = []
  const AttributesArr = [...atrributes.split('|')]
  if (!AttributesArr || !AttributesArr.length) return []
  for (const prop in AttributesArr) {
    if (AttributesArr[prop].includes(':')) {
      const attrItemsArr = AttributesArr[prop].split(':')
      const newattrItemsArr = []
      for (const i in attrItemsArr) {
        newattrItemsArr.push(attrItemsArr[i].trim())
      }
      AttributesArr[prop] = newattrItemsArr.join(':')
    }
    const attributeName = AttributesArr[prop].trim()
    const attributeSlug = slugify(attributeName, { lower: true })
    const found = await mongoClient.db().collection(dbTable).findOne({ name: attributeName })
    if (found) {
      attributeIds.push(new ObjectId(found._id))
    } else {
      const attr = await mongoClient.db().collection(dbTable).insertOne({ name: attributeName, slug: attributeSlug })
      if (attr && attr.insertedId) attributeIds.push(new ObjectId(attr.insertedId))
    }
  }

  return attributeIds
}

const createProducts = async (data: any, resolvedMedia: any, event: any) => {
  try {
    let found: any
    let productCreateErr = ''
    for (const prop in data) {
      let product: any = {}
      product.name = data[prop].acsPartNumber
      product.acsPartNumber = data[prop].acsPartNumber
      product.slug = slugify(product.name, { lower: true })
      product.price = data[prop].price * 1
      product.salePrice = data[prop].salePrice * 1
      product.sortOrder = 0
      product.tbq = data[prop].tbq ? true : false
      let oem: any = {}
      const oemName = data[prop].oem.trim()
      const oemSlug = slugify(oemName, { lower: true })
      found = await mongoClient.db().collection('oems').findOne({ name: oemName })
      if (found) {
        oem = found
        product.oem = new ObjectId(oem._id)
      } else {
        oem = await mongoClient.db().collection('oems').insertOne({ name: oemName, slug: oemSlug })
        if (oem && oem.insertedId) product.oem = new ObjectId(oem.insertedId)
      }

      let oemPartNumber: any = {}
      const oemPartNumberName = data[prop].oemPartNumber.trim()
      const oemPartNumberSlug = slugify(oemPartNumberName, { lower: true })
      found = await mongoClient.db().collection('oempartnumbers').findOne({ name: oemPartNumberName })
      if (found) {
        product.oemPartNumber = new ObjectId(found._id)
      } else {
        oemPartNumber = await mongoClient
          .db()
          .collection('oempartnumbers')
          .insertOne({ name: oemPartNumberName, slug: oemPartNumberSlug, oem: new ObjectId(oem._id) })
        if (oemPartNumber && oemPartNumber.insertedId) product.oemPartNumber = new ObjectId(oemPartNumber.insertedId)
      }

      const image = await mongoClient
        .db()
        .collection('media')
        .findOne({ originalFilename: `${data[prop].productImage}.jpg` })
      if (image) product.media = [new ObjectId(image._id)]

      product.eligibilities = await createAttributesModels('eligibilities', data[prop].eligibilities)
      product.nextHigherAssemblies = await createAttributesModels(
        'nexthigherassemblies',
        data[prop].nextHigherAssemblies
      )

      found = await mongoClient.db().collection('products').findOne({ name: product.name })
      console.log('FOUND', found)

      if (!found) {
        const newProduct = await mongoClient.db().collection('products').insertOne(product)
        console.log('NEW', newProduct)
      }
    }

    fs.renameSync(resolvedMedia.originalPath, `${uploadPath}${resolvedMedia.name}`)
    if (productCreateErr) return { info: productCreateErr }
    return { success: true }
  } catch (err) {
    errorHandler(event, err)
  }
}

const seedProducts = async (event: any) => {
  try {
    // Drop products, categories, eligibilities, oems, oempartnumbers and nexhighasssemlies cllections
    let collections = await mongoClient.db().listCollections().toArray()
    await Promise.all(
      collections.map(async (item: any) => {
        if (
          item.name === 'products' ||
          item.name === 'oems' ||
          item.name === 'oempartnumbers' ||
          item.name === 'eligibilities' ||
          item.name === 'nexthigherassemblies'
        )
          await mongoClient.db().collection(item.name).drop()
      })
    )

    // Recreate categories, eligibilities, oems, oempartnumbers and nexhighasssemlies collections and indexes
    const newCollections: string[] = ['oems', 'oempartnumbers', 'eligibilities', 'nexthigherassemblies']
    await Promise.all(
      newCollections.map(async (item: any) => {
        if (item === 'oems' || item === 'oempartnumbers' || item === 'eligibilities' || item === 'nexthigherassemblies')
          await mongoClient.db().createCollection(item, defaultSchema)
        await mongoClient.db().collection(item).createIndex({ name: 1 }, { unique: true })
      })
    )

    // Create products colection and indexes
    await mongoClient.db().createCollection('products', productSchema)
    await mongoClient.db().collection('products').createIndex({ name: 1 }, { unique: true })
    await mongoClient
      .db()
      .collection('products')
      .createIndex(
        { name: 'text', oemPartNumber: 'text', description: 'text' },
        { weights: { name: 3, oemPartNumber: 2, decsription: 1 } }
      )

    // Setup formidable fileupload
    const uploadPromise = new Promise((resolve, reject) => {
      const form = formidable({ multiples: true })
      form.parse(event.req, (err: any, fields: any, files: any) => {
        if (files.media.size > 1 * 1024 * 1024) reject('File size must be less than 1 MB')
        if (!files.media.mimetype.includes('csv')) reject(new AppError('Only csv format allowed!', 404))
        const uploadedMedia = {
          name: `${files.media.newFilename}${extname(files.media.originalFilename)}`,
          originalFilename: files.media.originalFilename,
          mimetype: files.media.mimetype,
          fileSize: files.media.size,
          originalPath: files.media.filepath,
          filePath:
            `/uploads/${files.media.newFilename}${extname(files.media.originalFilename)}` || '/uploads/placeholder.png',
        }
        resolve(uploadedMedia)
      })
    })

    const resolvedMedia: any = await uploadPromise
    console.log('MMMMMMMMMedia', resolvedMedia)

    const data: any[] = []
    fs.createReadStream(`${resolvedMedia.originalPath}`)
      .pipe(parse({ delimiter: ',', columns: true }))
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', async function () {
        await createProducts(data, resolvedMedia, event)
        return {
          status: 'succes',
        }
      })
      .on('error', function (error) {
        console.log(error.message)
      })
  } catch (err) {
    errorHandler(event, err)
  }
}

export { seedProducts }
