import { fetchAllUsers, createUser } from '~/server/controllers/v1/users'

export default defineEventHandler(async (event) => {
  // console.log(event.req)

  switch (event.req.method) {
    case 'GET':
      return await fetchAllUsers()
      break

    case 'POST':
      await createUser(event)
      // return response

      // console.log('ER', event.res)
      break

    default:
      break
  }
})
