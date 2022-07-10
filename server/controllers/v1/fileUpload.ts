import fs from 'fs'
import formidable from 'formidable'
import { extname } from 'path'
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import AppError from '~/server/utils/AppError'

// const config = useRuntimeConfig()
// console.log('CCCCC', config)

// const runtimeFile = fileURLToPath(new URL('./runtime', import.meta.url))
// const runtimeDir = path.dirname(`${runtimeFile}`)
// const uploadPath = `${path.join(runtimeDir, '../../public')}/uploads/`

const resolveFiles = (event: any) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(event.req, (err: any, fields: any, files: any) => {
      const uploadedMedia = []
      if (!Array.isArray(files.gallery)) {
        if (files.gallery.size > 1 * 1024 * 1024) reject(new AppError('File size must be less than 1 MB', 400))
        if (
          !files.gallery.mimetype.includes('image') &&
          !files.gallery.mimetype.includes('pdf') &&
          !files.gallery.mimetype.includes('csv')
        )
          reject(new AppError('Only image, pdf and csv format allowed!', 400))
        uploadedMedia[0] = {
          name: `${files.gallery.originalFilename}`,
          originalFilename: files.gallery.originalFilename,
          mimetype: files.gallery.mimetype,
          fileSize: files.gallery.size,
          originalPath: files.gallery.filepath,
          filePath: `uploads/${files.gallery.originalFilename}`,
        }
      } else {
        if (files.gallery.length > process.env.NUXT_PUBLIC_MAX_FILE_UPLOADS)
          reject(new AppError(`${process.env.NUXT_PUBLIC_MAX_FILE_UPLOADS} files max`, 400))
        for (const prop in files.gallery) {
          if (files.gallery[prop].size > 1 * 1024 * 1024) reject(new AppError('File size must be less than 1 MB', 400))
          if (
            !files.gallery[prop].mimetype.includes('image') &&
            !files.gallery[prop].mimetype.includes('pdf') &&
            !files.gallery[prop].mimetype.includes('csv')
          )
            reject(new AppError('Only image, pdf and csv format allowed!', 400))
          uploadedMedia[prop] = {
            name: `${files.gallery[prop].originalFilename}`,
            originalFilename: files.gallery[prop].originalFilename,
            mimetype: files.gallery[prop].mimetype,
            fileSize: files.gallery[prop].size,
            originalPath: files.gallery[prop].filepath,
            filePath: `uploads/${files.gallery[prop].originalFilename}`,
          }
        }
      }

      resolve(uploadedMedia)
    })
  })
}

const s3Client = new S3({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.NUXT_DO_SPACE_KEY,
    secretAccessKey: process.env.NUXT_DO_SPACE_SECRET,
  },
})

const uploadFile = async (fileName: any, originalPath: any) => {
  return await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.NUXT_DO_SPACE_BUCKET,
      Key: fileName,
      Body: fs.createReadStream(originalPath),
      ACL: 'public-read',
    })
  )
}

const deleteFile = async (fileName: any) => {
  return await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.NUXT_DO_SPACE_BUCKET,
      Key: fileName,
      // Body: fs.createReadStream(originalPath),
      // ACL: 'public-read',
    })
  )
}

export { resolveFiles, s3Client, uploadFile, deleteFile }
