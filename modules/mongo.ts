// modules/module.mjs
// import mongoose from 'mongoose'
import mongoClient from '../server/utils/mongoClient'
import { userSchema, gallerySchema, mediaSchema, countrySchema } from '../server/utils/mongoSchemas'

// import { MongomongoClient } from 'mongodb'

// console.log('CCCCC', config)

import colors from 'colors'

export default async (inlineOptions: any, nuxt: any) => {
  // const mongoClient = new MongomongoClient(inlineOptions.dbUrl)

  // const config = useRuntimeConfig()
  // console.log('CCCCC', config)
  // You can do whatever you like here..
  // console.log(inlineOptions.token) // `123`
  // console.log(nuxt.options.dev) // `true` or `false`
  nuxt.hook('listen', async (nuxt: any) => {
    try {
      // console.log('DB', inlineOptions)
      await mongoClient.connect()
      const collections = await mongoClient.db().listCollections().toArray()
      // console.log('Collections', collections)

      // Create users collection if it does not exist
      const userCollection = collections.find((c) => c.name === 'users')
      // console.log('G', userCollection)
      if (!userCollection) {
        await mongoClient.db().createCollection('users', userSchema)
        await mongoClient.db().collection('users').createIndex({ email: 1 }, { unique: true })
        await mongoClient
          .db()
          .collection('users')
          .createIndex({ name: 'text', email: 'text' }, { weights: { name: 1, email: 1 } })
      }

      // Create media collection if it does not exist
      const mediaCollection = collections.find((c) => c.name === 'media')
      // console.log('G', mediaCollection)
      if (!mediaCollection) {
        await mongoClient.db().createCollection('media', mediaSchema)
        await mongoClient.db().collection('media').createIndex({ name: 1 }, { unique: true })
        await mongoClient
          .db()
          .collection('media')
          .createIndex({ name: 'text', mimetype: 'text' }, { weights: { name: 2, mimetype: 1 } })
      }

      // Create galleries collection if it does not exist
      const galleryCollection = collections.find((c) => c.name === 'galleries')
      if (!galleryCollection) {
        await mongoClient.db().createCollection('galleries', gallerySchema)
        await mongoClient.db().collection('galleries').createIndex({ name: 1 }, { unique: true })
        await mongoClient
          .db()
          .collection('galleries')
          .createIndex({ name: 'text', description: 'text' }, { weights: { name: 2, decsription: 1 } })
      }

      // Create states collection if it does not exist
      const stateCollection = collections.find((c) => c.name === 'states')
      if (!stateCollection) {
        await mongoClient.db().createCollection('states', gallerySchema)
        await mongoClient.db().collection('states').createIndex({ name: 1 }, { unique: true })
        await mongoClient
          .db()
          .collection('states')
          .createIndex({ name: 'text', abbreviation: 'text' }, { weights: { name: 2, abbreviation: 1 } })
      }

      // Create states collection if it does not exist
      const countryCollection = collections.find((c) => c.name === 'countries')
      if (!countryCollection) {
        await mongoClient.db().createCollection('countries', countrySchema)
        await mongoClient.db().collection('countries').createIndex({ countryName: 1 }, { unique: true })
        await mongoClient
          .db()
          .collection('countries')
          .createIndex(
            { countryName: 'text', threeLetterCountryCode: 'text' },
            { weights: { countryName: 2, threeLetterCountryCode: 1 } }
          )
      }

      // await mongoose.connect(inlineOptions.dbUrl)
      console.log(colors.magenta.bold(`Database connection succesfull`))
    } catch (err) {
      console.log(colors.red.bold(`Mongo DB Error ${err}`))
    }
  })
}
