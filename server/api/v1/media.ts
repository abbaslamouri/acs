import { fetchAllMedia, createMedia } from '~/server/controllers/v1/media'

import path from 'path'
import { fileURLToPath } from 'url'
import { extname } from 'path'
import { sendError, createError } from 'h3'
import colors from 'colors'

import fs from 'fs'
import formidable from 'formidable'

import AppError from '~/server/utils/AppError'

export default defineEventHandler(async (event) => {
  switch (event.req.method) {
    case 'GET':
      const query = await useQuery(event)
      console.log('Query', query)
      return await fetchAllMedia(event)
      break

    case 'POST':
      console.log("LLLLLLLLL")
      return await createMedia(event)

      break

    default:
      break
  }

  // console.log(event.res)
  // switch (event.req.method) {
  //   case 'GET':
  //     const query = useQuery(event)
  //     console.log('Query', query)
  //     return await fetchAllUsers(event)
  //     break
  //   case 'POST':
  //     const body = useBody(event)
  //     console.log('BODY', await body)
  //     return { success: true }
  //     // return await createUser(event)
  //     break
  //   default:
  //     break
  // }
})
