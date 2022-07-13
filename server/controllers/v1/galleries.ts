import { ObjectId } from 'mongodb'

import AppError from '~/server/utils/AppError'
import errorHandler from '~/server/utils/errorHandler'

import mongoClient from '~/server/utils/mongoClient'

const createDoc = async (event: any, collection: string) => {
  // try {
  //   const body = await useBody(event)
  //   console.log('Body', body)
  //   for (const prop in body.media) {
  //     body.media[prop] = new ObjectId(body.media[prop]._id)
  //   }
  //   body.sortOrder = body.sortOrder * 1
  //   const savedDoc = await mongoClient.db().collection(collection).insertOne(body)
  //   if (!savedDoc || !savedDoc.insertedId) throw new AppError('We were not able to insert document into database', 404)
  //   return {
  //     insertedId: savedDoc.insertedId,
  //   }
  // } catch (err) {
  //   errorHandler(event, err)
  // }
}

const updateDoc = async (event: any, collection: string) => {
  // try {
  //   const body = await useBody(event)
  //   console.log('Body', body)
  //   for (const prop in body.media) {
  //     body.media[prop] = new ObjectId(body.media[prop]._id)
  //   }
  //   body.sortOrder = body.sortOrder * 1
  //   const _id = new ObjectId(body._id)
  //   delete body._id
  //   const savedDoc = await mongoClient
  //     .db()
  //     .collection(collection)
  //     .updateOne({ _id }, { $set: { ...body } })
  //   console.log('UPDATE', savedDoc)
  //   if (!savedDoc || !savedDoc.modifiedCount) throw new AppError('We were not able to update document', 404)
  //   return {
  //     modifiedCount: savedDoc.modifiedCount,
  //   }
  // } catch (err) {
  //   errorHandler(event, err)
  // }
}

export { createDoc, updateDoc }
