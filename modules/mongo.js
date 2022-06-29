// modules/module.mjs
import mongoose from 'mongoose'
import colors from 'colors'

export default async (inlineOptions, nuxt) => {
	// const config = useRuntimeConfig()
	// console.log('CCCCC', config)
	// You can do whatever you like here..
	console.log(inlineOptions.token) // `123`
	console.log(nuxt.options.dev) // `true` or `false`
	nuxt.hook('ready', async (nuxt) => {
		try {
			console.log('DB', inlineOptions.dbUrl)
			await mongoose.connect(inlineOptions.dbUrl)
			console.log(colors.magenta.bold(`Database connection succesfull`))
		} catch (err) {
			console.log(colors.red.bold(`Mongo DB Error ${err}`))
		}
	})
}
