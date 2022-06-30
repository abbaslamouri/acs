import client from '../../../mongo'

const fetchAllUsers = async () => {
  try {
    const users = await client.db().collection('users').findOne({})
    console.log('UUUU', users)
    return {
      users,
    }
  } catch (err) {
    console.log(err)
  } finally {
    // await client.close()
  }
}
export { fetchAllUsers }
