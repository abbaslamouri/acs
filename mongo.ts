import { MongoClient } from 'mongodb'

// const config = useRuntimeConfig()
// console.log('CCCCC', config)

const client = new MongoClient(
  'mongodb+srv://doadmin:316kz9WZU74rf8G5@lightmylamp-6d2bbfe9.mongo.ondigitalocean.com/lightmylamp?tls=true&authSource=admin&replicaSet=lightmylamp'
)

export default client
