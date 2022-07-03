import { fetchAllUsers, createUser } from '~/server/controllers/v1/users'

export default defineEventHandler(async (event) => {
  // console.log(event.req)

  switch (event.req.method) {
    case 'GET':
      // const query = useQuery(event)
      // console.log(query)
      return await fetchAllUsers(event)
      break

    case 'POST':
      return await createUser(event)

      // return response

      // console.log('ER', event.res)
      break

    default:
      break
  }
})
