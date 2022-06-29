import { User } from '../models/user'

export default defineEventHandler(async (event) => {
	const overAllCount = await User.countDocuments()
	console.log('OV', overAllCount)

	return {
		api: 'works',
	}
})
