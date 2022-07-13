// import { createMedia, deleteMedia } from '~~/server/controllers/v1/media'
import { fetchAll } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  const query: any = useQuery(event)
  console.log('Query', query)
  switch (event.req.method) {
    case 'GET':
      return await fetchAll(event, query, 'states')
      break

    case 'POST':
      // return await createMedia(event)
      break

    case 'DELETE':
      // return await deleteMedia(event)
      break

    default:
      break
  }
})
