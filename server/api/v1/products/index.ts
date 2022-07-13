import { fetchAll } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  const query: any = useQuery(event)
  console.log('Query', query)
  switch (event.req.method) {
    case 'GET':
      return await fetchAll(event, query, 'products')
      break

    case 'POST':
      // return await createProduct(event)

      break

    default:
      break
  }
})
