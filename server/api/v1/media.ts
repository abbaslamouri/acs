import { fetchAllMedia, createMedia, deleteMedia } from '~~/server/controllers/v1/media'

export default defineEventHandler(async (event) => {
  switch (event.req.method) {
    case 'GET':
      return await fetchAllMedia(event)
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
