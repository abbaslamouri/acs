import { MongoClient } from 'mongodb'

// const config = useRuntimeConfig()
// console.log('CCCCC', config)

const mongoClient = new MongoClient(process.env.NUXT_DB_URL)
// const db = mongoClient.db()

export default mongoClient
