import { createMedia, deleteMedia } from '~~/server/controllers/v1/media'
import { fetchAll } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  switch (event.req.method) {
    case 'GET':
      return await fetchAll(event, 'media')
      break

    case 'POST':
      return await createMedia(event)
      break

    case 'DELETE':
      return await deleteMedia(event)
      break

    default:
      break
  }
})
