import { fetchAllUsers, createUser } from '~/server/controllers/v1/users'

export default defineEventHandler(async (event) => {
  // console.log(event.res)

  switch (event.req.method) {
    case 'GET':
      const query = useQuery(event)
      // console.log('Query', query)
      return await fetchAllUsers(event)
      break

    case 'POST':
      return await createUser(event)

      break

    default:
      break
  }
})
