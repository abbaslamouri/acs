import { fetchAllUsers } from '~/server/controllers/v1/users'
export default defineEventHandler(async (event) => {
  console.log(event.req.url)

  switch (event.req.url) {
    case '/api/v1/users':
      return await fetchAllUsers()
      break

    default:
      break
  }
})
