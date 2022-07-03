import { sendError, createError } from 'h3'
import colors from 'colors'

// interface IAppErrorErrors {
//   path: any
//   value: any
//   message: string
// }

// interface ReturnError {
//   status: string
//   statusCode: number
//   errors: Array<IAppErrorErrors>
//   message?: string
//   err: Error
// }

const errorHandler = (event: any, err: any) => {
  console.log(colors.red.bold(`ERR ${err}`), err)

  let message = ''
  let statusCode = 400
  // let data: any

  console.log('NANE', err.name)

  if (err.name === 'CustomAPIError') {
    message = err.message
    statusCode = err.statusCode
  }

  if (err.name === 'MongoServerError') {
    if (err.code === 11000) {
      if (err.keyValue) {
        message = `${Object.values(err.keyValue)[0]} already exists. Please select a different ${
          Object.keys(err.keyValue)[0]
        }`
      }
      // data = err
    }

    if (err.code === 121) {
      const schemaRulesNotSatisfied = err.errInfo.details.schemaRulesNotSatisfied
      if (schemaRulesNotSatisfied && schemaRulesNotSatisfied.length) {
        for (const i in schemaRulesNotSatisfied) {
          if (schemaRulesNotSatisfied[i].operatorName === 'required') {
            for (const j in schemaRulesNotSatisfied[i].missingProperties) {
              message += `${schemaRulesNotSatisfied[i].missingProperties[j]} is required<br>`
              console.log('M1', message)
            }
          }
          if (schemaRulesNotSatisfied[i].operatorName === 'properties') {
            for (const j in schemaRulesNotSatisfied[i].propertiesNotSatisfied) {
              for (const k in schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].details) {
                message += `${schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].details[k].operatorName}: ${schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].details[k].reason} ${schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].propertyName}=${schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].details[k].consideredValue} <br>`
              }
            }
          }
        }
      }
      // data = err.errInfo.details.schemaRulesNotSatisfied
    }
  }
  // const error = new AppError(message, statusCode)
  console.log(statusCode)
  console.log(message)
  return sendError(
    event,
    createError({
      statusCode: statusCode,
      statusMessage: message,
      data: err,
    })
  )
}

export default errorHandler
