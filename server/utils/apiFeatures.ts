class ApiFeatures {
  query: any
  DBModel: any
  constructor(query: any, public queryObj: any, DBModel: any) {
    this.query = query
    this.queryObj = queryObj
    this.DBModel = DBModel
  }

  filter() {
    // filter query
    const newQueryObj: {
      [key: string]: number | string
    } = { ...this.queryObj }
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword', 'populate']
    excludedFields.forEach((el) => delete newQueryObj[el])

    // Advanced filtering
    let queryStr = JSON.stringify(newQueryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    // console.log(JSON.parse(queryStr))

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  search() {
    // console.log('QQQQQ', this.DBModel.collection.collectionName)
    if (!this.queryObj.keyword) return this
    const regex = new RegExp(this.queryObj.keyword, 'i')

    if (this.DBModel.collection.collectionName === 'media') {
      this.query = this.query.or([
        { name: { $regex: regex } },
        { originalName: { $regex: regex } },
        { mimetype: { $regex: regex } },
      ])
    } else {
      this.query = this.query.or([{ name: { $regex: regex } }])
    }
    return this
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    }
    return this
  }

  fields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    // console.log('KEY', this.queryObj.keyword)

    // if (!this.queryObj.keyword) {
    const page = this.queryObj.page * 1 >= 1 ? this.queryObj.page * 1 : 1
    const limit = this.queryObj.limit * 1 >= 1 ? this.queryObj.limit * 1 : 1000
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    // }
    return this
  }

  populate() {
    if (this.queryObj.populate) this.query = this.query.populate(this.queryObj.populate)
    return this
  }
}

export default ApiFeatures
