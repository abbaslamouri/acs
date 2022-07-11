import fs from 'fs'
import formidable from 'formidable'
import { extname } from 'path'
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import AppError from '~/server/utils/AppError'

const config = useRuntimeConfig()
// console.log('CCCCC', config.public.maxFileUploads)
// console.log('CCCCC', { ...config })

// const config = useRuntimeConfig()
// console.log('CCCCC', config)

// const runtimeFile = fileURLToPath(new URL('./runtime', import.meta.url))
// const runtimeDir = path.dirname(`${runtimeFile}`)
// const uploadPath = `${path.join(runtimeDir, '../../public')}/uploads/`

const resolveFiles = (event: any) => {
  return new Promise((resolve, reject) => {
    // console.log('CCCCC', config.public.maxFileUploads)

    const form = formidable({ multiples: true })
    form.parse(event.req, (err: any, fields: any, files: any) => {
      const uploadedMedia = []
      // console.log('FIles', files)
      if (!Array.isArray(files.media)) {
        if (files.media.size > 1 * 1024 * 1024) reject(new AppError('File size must be less than 1 MB', 400))
        if (
          !files.media.mimetype.includes('image') &&
          !files.media.mimetype.includes('pdf') &&
          !files.media.mimetype.includes('csv')
        )
          reject(new AppError('Only image, pdf and csv format allowed!', 400))
        uploadedMedia[0] = {
          name: `${files.media.originalFilename}`,
          originalFilename: files.media.originalFilename,
          mimetype: files.media.mimetype,
          fileSize: files.media.size,
          originalPath: files.media.filepath,
          filePath: `uploads/${files.media.originalFilename}`,
        }
      } else {
        if (files.media.length > config.public.maxFileUploads)
          reject(new AppError(`${config.public.maxFileUploads} files max`, 400))
        for (const prop in files.media) {
          if (files.media[prop].size > 1 * 1024 * 1024) reject(new AppError('File size must be less than 1 MB', 400))
          if (
            !files.media[prop].mimetype.includes('image') &&
            !files.media[prop].mimetype.includes('pdf') &&
            !files.media[prop].mimetype.includes('csv')
          )
            reject(new AppError('Only image, pdf and csv format allowed!', 400))
          uploadedMedia[prop] = {
            name: `${files.media[prop].originalFilename}`,
            originalFilename: files.media[prop].originalFilename,
            mimetype: files.media[prop].mimetype,
            fileSize: files.media[prop].size,
            originalPath: files.media[prop].filepath,
            filePath: `uploads/${files.media[prop].originalFilename}`,
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
