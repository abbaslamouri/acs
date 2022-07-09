import { fetchAll } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  switch (event.req.method) {
    case 'GET':
      return await fetchAll(event, 'products')
      break

    case 'POST':
      // return await createProduct(event)

      break

    default:
      break
  }
})
