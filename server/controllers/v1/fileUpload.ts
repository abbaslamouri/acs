import formidable from 'formidable'
import { extname } from 'path'
import AppError from '~/server/utils/AppError'

const fileUpload = (event: any) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(event.req, (err: any, fields: any, files: any) => {
      if (files.media.size > 1 * 1024 * 1024) reject('File size must be less than 1 MB')
      if (!files.media.mimetype.includes('csv')) reject(new AppError('Only csv format allowed!', 404))
      const uploadedMedia = {
        name: `${files.media.newFilename}${extname(files.media.originalFilename)}`,
        originalFilename: files.media.originalFilename,
        mimetype: files.media.mimetype,
        fileSize: files.media.size,
        originalPath: files.media.filepath,
        filePath:
          `/uploads/${files.media.newFilename}${extname(files.media.originalFilename)}` || '/uploads/placeholder.png',
      }
      resolve(uploadedMedia)
    })
  })
}

export default fileUpload
