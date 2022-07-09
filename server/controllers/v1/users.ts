import AppError from '~/server/utils/AppError'
import mongoClient from '~~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'

const fetchAllUsers = async (event: any) => {
  try {
    const totalCount = await mongoClient.db().collection('users').countDocuments()
    const users = await mongoClient.db().collection('users').find().toArray()
    if (users) throw new AppError('We were not able to fetch users', 400)
    return {
      users,
      totalCount,
      count: users.length,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const fetchUserById = async (event: any) => {
  try {
    const query = useQuery(event)
    console.log(query)
    const user = await mongoClient.db().collection('users').findOne({ _id: query.id })
    return {
      user,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

const createUser = async (event: any) => {
  try {
    const body = await useBody(event)
    const user = { ...body, name: body.name.trim(), email: body.email.trim().toLowerCase() }
    user.role = user.role || 'user'
    const savedUser = await mongoClient.db().collection('users').insertOne(user)
    if (!savedUser || !savedUser.insertedId) throw new AppError('We were not able to insert user into database', 404)
    const found = await mongoClient.db().collection('users').findOne({ _id: savedUser.insertedId })
    return {
      user: found,
    }
  } catch (err) {
    errorHandler(event, err)
  }
}

export { fetchAllUsers, fetchUserById, createUser }
