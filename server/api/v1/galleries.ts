import { ObjectId } from 'mongodb'

import { fetchAll, insertDoc, updateDoc, deleteDoc } from '~/server/controllers/v1/factory'
// import { deleteDoc } from '~/server/controllers/v1/galleries'

export default defineEventHandler(async (event) => {
  let body: any
  const query: any = useQuery(event)
  // console.log('Query', query)

  switch (event.req.method) {
    case 'GET':
      return await fetchAll(event, query, 'galleries')
      break

    case 'POST':
    case 'PATCH':
      body = await useBody(event)
      console.log('Body', body)
      for (const prop in body.media) {
        body.media[prop] = new ObjectId(body.media[prop]._id)
      }
      body.sortOrder = body.sortOrder * 1
      if (event.req.method === 'POST') return await insertDoc(event, body, 'galleries')
      else return await updateDoc(event, body, 'galleries')
      break

    case 'DELETE':
      return await deleteDoc(event, query, 'galleries')
      break

    // case 'PATCH':
    //   body = await useBody(event)
    //   console.log('Body', body)
    //   for (const prop in body.media) {
    //     body.media[prop] = new ObjectId(body.media[prop]._id)
    //   }
    //   body.sortOrder = body.sortOrder * 1
    //   return await updateDoc(event, body, 'galleries')
    //   break

    default:
      break
  }
})
