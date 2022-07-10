import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse'
import slugify from 'slugify'
import errorHandler from '~/server/utils/errorHandler'
import mongoClient from '~/server/utils/mongoClient'
import { ObjectId } from 'mongodb'
import { defaultSchema, productSchema } from '~/server/utils/mongoSchemas'
import { resolveFiles } from '~/server/controllers/v1/fileUpload'

const runtimeFile = fileURLToPath(new URL('./runtime', import.meta.url))
const runtimeDir = path.dirname(`${runtimeFile}`)
const uploadPath = `${path.join(runtimeDir, '../../public')}/uploads/`

const resetCollections = async () => {
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
}

const createObjectAttributeCollection = async (collection: any, attribute: any) => {
  let newObjectId: any
  const found = await mongoClient.db().collection(collection).findOne({ name: attribute.name })
  if (found) {
    newObjectId = new ObjectId(found._id)
  } else {
    const createdAttribute = await mongoClient.db().collection(collection).insertOne(attribute)
    if (createdAttribute && createdAttribute.insertedId) newObjectId = new ObjectId(createdAttribute.insertedId)
  }
  return newObjectId
}

const createArrayAttributeCollection = async (collection: any, atrributes: any) => {
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
    const found = await mongoClient.db().collection(collection).findOne({ name: attributeName })
    if (found) {
      attributeIds.push(new ObjectId(found._id))
    } else {
      const attr = await mongoClient.db().collection(collection).insertOne({ name: attributeName, slug: attributeSlug })
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

      // Create OEMS
      const oemName = data[prop].oem.trim()
      const oemSlug = slugify(oemName, { lower: true })
      const oemObjectId = await createObjectAttributeCollection('oems', { name: oemName, slug: oemSlug })
      product.oem = oemObjectId

      // Create OEM Part Numbers
      const oemPartNumberName = data[prop].oemPartNumber.trim()
      const oemPartNumberSlug = slugify(oemPartNumberName, { lower: true })
      const oemPartNumberObjectId = await createObjectAttributeCollection('oempartnumbers', {
        name: oemPartNumberName,
        slug: oemPartNumberSlug,
        oem: oemObjectId,
      })
      product.oemPartNumber = oemPartNumberObjectId

      // Create Images
      const image = await mongoClient
        .db()
        .collection('media')
        .findOne({ originalFilename: `${data[prop].productImage}.jpg` })
      if (image) product.media = [new ObjectId(image._id)]

      // Create Eligibilities
      product.eligibilities = await createArrayAttributeCollection('eligibilities', data[prop].eligibilities)

      // Create Next Higher Assembly
      product.nextHigherAssemblies = await createArrayAttributeCollection(
        'nexthigherassemblies',
        data[prop].nextHigherAssemblies
      )

      // Create product
      found = await mongoClient.db().collection('products').findOne({ name: product.name })
      if (!found) {
        const newProduct = await mongoClient.db().collection('products').insertOne(product)
        console.log('NEW', newProduct)
      }
    }

    if (productCreateErr) return { info: productCreateErr }
    return { success: true }
  } catch (err) {
    errorHandler(event, err)
  }
}

const seedProducts = async (event: any) => {
  try {
    await resetCollections()

    const resolvedMedia: any = await resolveFiles(event)

    const data: any[] = []
    fs.createReadStream(`${resolvedMedia.originalPath}`)
      .pipe(parse({ delimiter: ',', columns: true }))
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', async function () {
        await createProducts(data, resolvedMedia, event)
        fs.renameSync(resolvedMedia.originalPath, `${uploadPath}${resolvedMedia.name}`)
        console.log('Products Created')
      })
      .on('error', function (error) {
        console.log(error.message)
      })

    return 'File Uploaded and productuct creation underway....'
  } catch (err) {
    errorHandler(event, err)
  }
}

export { seedProducts }
