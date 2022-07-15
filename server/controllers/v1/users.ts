import { ObjectId } from 'mongodb'
import AppError from '~/server/utils/AppError'
import mongoClient from '~/server/utils/mongoClient'
import errorHandler from '~/server/utils/errorHandler'

const fetchAllUsers = async (event: any, query: any, collection: string) => {
  let cursor: any

  // console.log('Q', query)

  try {
    const totalCount = await mongoClient.db().collection(collection).countDocuments()

    const pipeline: any = []

    // Match stage
    if (query.keyword || query.match) {
      let matchObj: any = {}

      if (query.keyword) {
        matchObj = { $text: { $search: query.keyword } }
      } else if (query.match) {
        const queryStr = query.match.replace(/\b(eq|gte|gt|lte|lt)\b/g, (match: any) => `$${match}`)
        const queryStrArr = queryStr.split(',')
        // matchObj = {}
        for (const prop in queryStrArr) {
          const fieldParts = queryStrArr[prop].trim().split(']=')
          const valueParts = fieldParts[0].split('[')
          const field = valueParts[0]
          const operator = valueParts[1]
          let value = fieldParts[1]
          const typeCheckObj = {}
          typeCheckObj[field] = { $type: 'number' }
          const found = await mongoClient.db().collection(collection).find(typeCheckObj).toArray()
          if (found.length) value = value * 1
          matchObj[field] = {}
          if (field === '_id') matchObj[field][operator] = new ObjectId(value)
          else matchObj[field][operator] = value
        }
      }
      pipeline.push({ $match: { ...matchObj } })
    }

    // Lookup stage
    // if (query.lookup) {
    //   const lookupArr = query.lookup.split(',')
    //   for (const prop in lookupArr) {
    //     const lookupObj = {
    //       from: lookupArr[prop].trim().split('.')[lookupArr[prop].trim().split('.').length - 1],
    //       localField: lookupArr[prop].trim(),
    //       foreignField: '_id',
    //       as: lookupArr[prop].trim(),
    //     }

    pipeline.push({
      $unwind: {
        path: '$userAddresses',
        preserveNullAndEmptyArrays: true,
      },
    })
    pipeline.push({
      $unwind: {
        path: '$userAddresses.phoneNumbers',
        preserveNullAndEmptyArrays: true,
      },
    })

    pipeline.push({
      $lookup: {
        from: 'countries',
        localField: 'userAddresses.phoneNumbers.phoneCountryCode',
        foreignField: '_id',
        as: 'userAddresses.phoneNumbers.phoneCountryCode',
      },
    })
    pipeline.push({
      $unwind: {
        path: '$userAddresses.phoneNumbers.phoneCountryCode',
        preserveNullAndEmptyArrays: true,
      },
    })

    // pipeline.push({
    //   $group: {
    //     _id: '$userAddresses._id',
    //     phoneNumbers: {
    //       $push: '$phoneNumbers',
    //     },
    //   },
    // })

    // pipeline.push({
    //   $group: {
    //     _id: '_id',
    //   },
    // })

    //   }
    // }

    // Project stage
    if (query.project) {
      const projectObj = {}
      const projectArr = query.project.split(',')
      for (const prop in projectArr) {
        projectObj[projectArr[prop].trim()] = 1
      }
      pipeline.push({ $project: { ...projectObj } })
    }

    // Sort stage
    if (query.sort) {
      const sortArr = query.sort.split('-')
      const sortObj = {}
      if (sortArr.length === 1) sortObj[sortArr[0]] = 1
      else sortObj[sortArr[1]] = -1
      pipeline.push({ $sort: sortObj })
    }

    // Skip and limit
    const page = query.page && query.page * 1 >= 1 ? query.page * 1 : 1
    const limit = query.limit && query.limit * 1 > 0 ? query.limit * 1 : 100
    const skip = (page - 1) * limit
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    console.log('Pipeline', pipeline)

    cursor = mongoClient.db().collection(collection).aggregate(pipeline)
    const docs = await cursor.toArray()
    if (!docs) throw new AppError(`We were not able to fetch ${collection}`, 400)
    return {
      docs,
      totalCount,
      count: docs.length,
    }
  } catch (err) {
    errorHandler(event, err)
  }
  // try {
  //   const totalCount = await mongoClient.db().collection('users').countDocuments()
  //   const users = await mongoClient.db().collection('users').find().toArray()
  //   if (users) throw new AppError('We were not able to fetch users', 400)
  //   return {
  //     users,
  //     totalCount,
  //     count: users.length,
  //   }
  // } catch (err) {
  //   errorHandler(event, err)
  // }
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
