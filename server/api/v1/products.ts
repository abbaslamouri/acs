import { fetchAllProducts, createProduct, deleteProduct } from '~~/server/controllers/v1/products'

export default defineEventHandler(async (event) => {
  switch (event.req.method) {
    case 'GET':
      return await fetchAllProducts(event)
      break

    case 'POST':
      return await createProduct(event)
      break

    case 'DELETE':
      return await deleteProduct(event)
      break

    default:
      break
  }
})
