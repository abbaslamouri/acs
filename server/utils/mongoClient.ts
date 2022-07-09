import { MongoClient } from 'mongodb'

const mongoClient = new MongoClient(process.env.NUXT_DB_URL)

export default mongoClient
