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
  const query = useQuery(event)
  console.log('Query', query.docs)
  // if(!query.docs) return
  // for(const prop in query.docs){

  // }

  switch (event.req.method) {
    case 'GET':
      return await fetchAllMedia(event)
      break

    case 'POST':
      // const body = await useBody(event)
      // console.log('Body', body)
      // if (body.action === 'delete') return deleteMedia(event, body)
      return await createMedia(event)
      // return await createMedia(event)

      break

    case 'DELETE':
      const body = await useBody(event)
      console.log('Body', body)
      return await deleteMedia(event, body)

    //   break

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
