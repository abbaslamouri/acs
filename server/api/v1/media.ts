import { fetchAllMedia, createMedia, deleteMedia } from '~~/server/controllers/v1/media'

import path from 'path'
import { fileURLToPath } from 'url'
import { extname } from 'path'
import { sendError, createError } from 'h3'
import colors from 'colors'

import fs from 'fs'
import formidable from 'formidable'

import AppError from '~/server/utils/AppError'

export default defineEventHandler(async (event) => {
  console.log('MMMMMMMM', event.req.method)
  const query = useQuery(event)
  console.log('Query', query)

  // const body = await useBody(event)
  // console.log('Body', body)

  switch (event.req.method) {
    case 'GET':
      return await fetchAllMedia(event)
      break

    case 'POST':
      return await createMedia(event)

      break

    case 'DELETE':
      return await deleteMedia(event, query)

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
