import { Request, Response, NextFunction } from 'express'
import colors from 'colors'
import AppError from './AppError'

interface IAppErrorErrors {
  path: any
  value: any
  message: string
}

interface ReturnError {
  status: string
  statusCode: number
  errors: Array<IAppErrorErrors>
  message?: string
  err: Error
}

const sendError = (res: Response, returnError: ReturnError) => {
  if (process.env.NODE_ENV !== 'development') {
    res.status(returnError.statusCode).json(returnError)
  } else {
    if (!returnError.errors.length)
      returnError.errors.push({
        path: '',
        value: '',
        message: 'Something went terribly wrong',
      })
    res.status(returnError.statusCode).json({
      status: returnError.status,
      errors: returnError.errors,
    })
  }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(colors.red.bold(`ERROR, ${err}`))
  // console.log(colors.red.bold(`ERROR Name, ${err.name}`))
  // console.log(colors.red.bold(`ERROR Message, ${err.message}`))

  const returnError: ReturnError = {
    status: 'error',
    statusCode: err.statusCode ? err.statusCode : 500,
    errors: [],
    err,
  }

  if (err.custom) {
    returnError.errors.push({
      path: '',
      value: '',
      message: err.message,
    })
  } else {
    // Mongodb errors
    returnError.statusCode = 400
    if (err.name === 'ValidationError') {
      if (err.errors) {
        for (const prop in err.errors) {
          returnError.errors.push({
            path: err.errors[prop].path,
            value: err.errors[prop].value,
            message: err.errors[prop].message,
          })
        }
      }
    } else if (err.code === 11000) {
      if (err.keyValue) {
        returnError.errors.push({
          path: Object.keys(err.keyValue)[0],
          value: Object.values(err.keyValue)[0],
          message: `${Object.values(err.keyValue)[0]} already exists. Please select a different ${
            Object.keys(err.keyValue)[0]
          }`,
        })
      }
    } else if (err.name.includes('TokenExpiredError')) {
      returnError.errors.push({
        path: 'jwt',
        value: err.name ? err.name : 'TokenExpiredError',
        message: 'Your Token has expired, please login',
      })
    } else {
      returnError.errors.push({
        path: err.name ? err.name : '',
        value: '',
        message: err.message,
      })
    }

    // if (err.name && err.name === 'CastError') {
    //   if(err.path && err.value
    //   error = new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'castError')

    // } else if (err.name === 'ValidationError') {
    //   let errorStr =''
    //   if (err.errors) errorStr= Object.values(err.errors).map((item) => item.message)
    //   error = new AppError(errorStr, 400, 'validationError')
    // } else if (err.name === 'JsonWebTokenError') {
    //   error = new AppError(`Invalid token`, 401, 'jsonWebTokenError')
    // } else if (err.name === 'TokenExpiredError') {
    //   error = new AppError(`Your token has expired. please login`, 401, 'tokenExpiredError')
    // } else error = err
  }

  sendError(res, returnError)
}

export default errorHandler
