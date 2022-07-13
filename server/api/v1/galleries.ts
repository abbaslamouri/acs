import { ObjectId } from 'mongodb'

import { fetchAll, insertDoc, updateDoc } from '~/server/controllers/v1/factory'
// import { createDoc } from '~/server/controllers/v1/galleries'

export default defineEventHandler(async (event) => {
  let body: any
  switch (event.req.method) {
    case 'GET':
      return await fetchAll(event, 'galleries')
      break

    case 'POST':
      case 'PATCH':
      body = await useBody(event)
      console.log('Body', body)
      for (const prop in body.media) {
        body.media[prop] = new ObjectId(body.media[prop]._id)
      }
      body.sortOrder = body.sortOrder * 1
      return await insertDoc(event, body, 'galleries')
      break

    case 'PATCH':
      body = await useBody(event)
      console.log('Body', body)
      for (const prop in body.media) {
        body.media[prop] = new ObjectId(body.media[prop]._id)
      }
      body.sortOrder = body.sortOrder * 1
      return await updateDoc(event, body, 'galleries')
      break

    default:
      break
  }
})
