import mongoClient from '~/server/utils/mongoClient'
import { ObjectId } from 'mongodb'
import errorHandler from '~/server/utils/errorHandler'
import { resolveFiles, uploadFile, deleteFile } from '~/server/controllers/v1/fileUpload'

const createMedia = async (event: any) => {
  try {
    const resolvedMedia: any = await resolveFiles(event)
    let returnError = ''
    const createdMediaNames = []
    for (const prop in resolvedMedia) {
      const found = await mongoClient
        .db()
        .collection('media')
        .findOne({ originalFilename: resolvedMedia[prop].originalFilename })
      if (found) {
        returnError += `${resolvedMedia[prop].originalFilename} already exists <br>`
      } else {
        const newMedia = await mongoClient.db().collection('media').insertOne(resolvedMedia[prop])
        if (!newMedia || !newMedia.insertedId)
          returnError += `Unable to create ${resolvedMedia[prop].originalFilename} already exists <br>`
        else createdMediaNames.push(resolvedMedia[prop].name)
      }
      await uploadFile(`uploads/${resolvedMedia[prop].originalFilename}`, resolvedMedia[prop].originalPath)
    }

    return true
  } catch (err) {
    errorHandler(event, err)
  }
}

const deleteMedia = async (event: any) => {
  try {
    const body = await useBody(event)
    await Promise.all(
      body.map(async (item: any) => {
        const deletedDoc = await mongoClient
          .db()
          .collection('media')
          .deleteOne({ _id: new ObjectId(item._id) })
        console.log('deletedS', deletedDoc)
        if (deletedDoc && deletedDoc.deletedCount) {
          const deletedFile = await deleteFile(`uploads/${item.name}`)
          console.log('Delete', deletedFile)
        }
      })
    )
    return true
  } catch (err) {
    errorHandler(event, err)
  }
}

export { createMedia, deleteMedia }
