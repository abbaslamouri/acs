// modules/module.mjs
// import mongoose from 'mongoose'
import mongoClient from '../mongo'

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
      console.log('DB', inlineOptions)
      await mongoClient.connect()

      // await mongoose.connect(inlineOptions.dbUrl)
      console.log(colors.magenta.bold(`Database connection succesfull`))
    } catch (err) {
      console.log(colors.red.bold(`Mongo DB Error ${err}`))
    }
  })
}
