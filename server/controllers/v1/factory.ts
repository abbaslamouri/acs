import { ObjectId } from 'mongodb'
import AppError from '~/server/utils/AppError'
import errorHandler from '~/server/utils/errorHandler'

import mongoClient from '~/server/utils/mongoClient'

const insertDoc = async (event: any, body: any, collection: string) => {
  try {
    const insertedDoc = await mongoClient.db().collection(collection).insertOne(body)
    if (!insertedDoc || !insertedDoc.insertedId)
      throw new AppError('We were not able to insert document into database', 404)
    return {
      insertedId: insertedDoc.insertedId,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const updateDoc = async (event: any, body: any, collection: string) => {
  try {
    const _id = new ObjectId(body._id)
    delete body._id
    const updatedDoc = await mongoClient
      .db()
      .collection(collection)
      .updateOne({ _id }, { $set: { ...body } })
    console.log('UPDATExx', updatedDoc)
    if (!updatedDoc || !updatedDoc.modifiedCount) throw new AppError('We were not able to update document', 404)
    return {
      modifiedCount: updatedDoc.modifiedCount,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const deleteDoc = async (event: any, query: any, collection: string) => {
  try {
    const deletedDoc = await mongoClient
      .db()
      .collection(collection)
      .deleteOne({ _id: new ObjectId(query.id) })
    if (!deletedDoc || !deletedDoc.deletedCount) throw new AppError('We were not able to delete document', 404)
    return {
      deletedCount: deletedDoc.deletedCount,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const createDoc = async (event: any, collection: string) => {
  try {
    const body = await useBody(event)
    console.log('Body', body)
    // const doc = { ...body, name: body.name.trim() }
    // doc.slug = slugify(oemName, { lower: true }
    // user.role = user.role || 'user'
    const savedDoc = await mongoClient.db().collection(collection).insertOne(body)
    if (!savedDoc || !savedDoc.insertedId) throw new AppError('We were not able to insert document into database', 404)
    const found = await mongoClient.db().collection(collection).findOne({ _id: savedDoc.insertedId })
    return {
      doc: found,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const fetchAll = async (event: any, query: any, collection: string) => {
  let cursor: any

  try {
    const totalCount = await mongoClient.db().collection(collection).countDocuments()

    const pipeline: any = []

    // Match stage
    if (query.keyword || query.match) {
      let matchObj: any = {}

      if (query.keyword) {
        matchObj = { $text: { $search: query.keyword } }
      } else if (query.match) {
        const queryStr = query.match.replace(/\b(eq|gte|gt|lte|lt)\b/g, (match: any) => `$${match}`)
        const queryStrArr = queryStr.split(',')
        // matchObj = {}
        for (const prop in queryStrArr) {
          const fieldParts = queryStrArr[prop].trim().split(']=')
          const valueParts = fieldParts[0].split('[')
          const field = valueParts[0]
          const operator = valueParts[1]
          let value = fieldParts[1]
          const typeCheckObj = {}
          typeCheckObj[field] = { $type: 'number' }
          const found = await mongoClient.db().collection(collection).find(typeCheckObj).toArray()
          if (found.length) value = value * 1
          matchObj[field] = {}
          if (field === '_id') matchObj[field][operator] = new ObjectId(value)
          else matchObj[field][operator] = value
        }
      }
      pipeline.push({ $match: { ...matchObj } })
    }

    // Lookup stage
    if (query.lookup) {
      const lookupArr = query.lookup.split(',')
      for (const prop in lookupArr) {
        const lookupObj = {
          from: lookupArr[prop].trim(),
          localField: lookupArr[prop].trim(),
          foreignField: '_id',
          as: lookupArr[prop].trim(),
        }
        pipeline.push({ $lookup: { ...lookupObj } })
      }
    }

    // Project stage
    if (query.project) {
      const projectObj = {}
      const projectArr = query.project.split(',')
      for (const prop in projectArr) {
        projectObj[projectArr[prop].trim()] = 1
      }
      pipeline.push({ $project: { ...projectObj } })
    }

    // Sort stage
    if (query.sort) {
      const sortArr = query.sort.split('-')
      const sortObj = {}
      if (sortArr.length === 1) sortObj[sortArr[0]] = 1
      else sortObj[sortArr[1]] = -1
      pipeline.push({ $sort: sortObj })
    }

    const page = query.page && query.page * 1 >= 1 ? query.page * 1 : 1
    const limit = query.limit && query.limit * 1 >= 1 ? query.limit * 1 : 100
    const skip = (page - 1) * limit
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    console.log('Pipeline', pipeline)

    cursor = mongoClient.db().collection(collection).aggregate(pipeline)
    const docs = await cursor.toArray()
    if (!docs) throw new AppError(`We were not able to fetch ${collection}`, 400)
    return {
      docs,
      totalCount,
      count: docs.length,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

export { fetchAll, insertDoc, updateDoc, createDoc, deleteDoc }
