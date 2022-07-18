import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['@/assets/styles/main.css'],

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
        dbUrl: process.env.NUXT_DB_URL,
      },
    ],

    // Inline module definition
    // async (inlineOptions, nuxt) => { }
  ],

  runtimeConfig: {
    dbUrl: '',
    jwtSecret: '',
    jwtMaxAge: '',
    jwtSignupTokenMaxAge: '',
    pwResetTokenMaxAge: '',
    sendgridApiKey: '',
    sendgridSignupTemplateId: '',
    sendgridPasswordResetTemplateId: '',
    sendgridOrderReceivedTemplateId: '',

    public: {
      apiUrl: '',
      siteUrl: '',
      doSpaceEndpoint: '',
      maxFileUploads: '',
      fromEmail: '',
      fromName: '',
    },
  },
})
