import { MongoClient } from 'mongodb'

// const config = useRuntimeConfig()
// console.log('CCCCC', config)

const client = new MongoClient(process.env.NUXT_DB_URL)

export default client
