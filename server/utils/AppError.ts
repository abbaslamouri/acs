class AppError extends Error {
  // statusCode?: number

  custom: boolean
  name: string
  // code?: number
  // errors?: IAppErrorErrors
  // keyValue?: object
  // custom: boolean
  // errorCode: string
  constructor(
    message: string,
    public statusCode: number // public code?: number, // public keyValue?: object, // public errorCode?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.custom = true
    this.name = 'CustomAPIError'
    // this.custom = true
    // this.code = code
    // this.keyValue = keyValue
    this.message = message ? message : 'Something went terribly wrong'

    // const status = err.status ? err.status : 'error'
    // const statusCode = err.statusCode ? err.statusCode : 500
    // this.message = message
    // this.errorCode = errorCode
    Error.captureStackTrace(this, this.constructor)
  }
}

// interface IAppErrorErrors {
//   path: object
//   value: object
//   message: object
// }

export default AppError
