// modules/module.mjs
// import mongoose from 'mongoose'
import mongoClient from '../server/utils/mongoClient'
import { galleriesSchema, mediaSchema } from '../server/utils/mongoSchemas'

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

      // Create media collection if it does not exist
      const media = collections.find((c) => c.name === 'media')
      // console.log('G', media)
      if (!media) {
        await mongoClient.db().createCollection('media', mediaSchema)
        await mongoClient.db().collection('media').createIndex({ name: 1 }, { unique: true })
        await mongoClient
          .db()
          .collection('media')
          .createIndex({ name: 'text', mimetype: 'text' }, { weights: { name: 2, mimetype: 1 } })
      }

      // Create galleries collection if it does not exist
      const galleries = collections.find((c) => c.name === 'galleries')
      // console.log('G', galleries)
      if (!galleries) {
        await mongoClient.db().createCollection('galleries', galleriesSchema)
        await mongoClient.db().collection('galleries').createIndex({ name: 1 }, { unique: true })
        await mongoClient
          .db()
          .collection('galleries')
          .createIndex({ name: 'text', description: 'text' }, { weights: { name: 2, decsription: 1 } })
      }

      // await mongoose.connect(inlineOptions.dbUrl)
      console.log(colors.magenta.bold(`Database connection succesfull`))
    } catch (err) {
      console.log(colors.red.bold(`Mongo DB Error ${err}`))
    }
  })
}
