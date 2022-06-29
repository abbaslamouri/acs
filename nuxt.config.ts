import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	buildModules: ['nuxt-windicss'],

	modules: [
		// Using package name (recommended usage)
		// '@nuxtjs/example',

		// Load a local module
		// './modules/example',

		// Add module with inline-options
		[
			'./modules/mongo',
			{
				dbUrl:
					'mongodb+srv://doadmin:316kz9WZU74rf8G5@lightmylamp-6d2bbfe9.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=lightmylamp',
			},
		],

		// Inline module definition
		// async (inlineOptions, nuxt) => { }
	],

	runtimeConfig: {
		dbUrl: '',

		public: {
			apiUrl: '',
			backendUrl: '',
		},
	},
})
