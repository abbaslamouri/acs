const mediaSchema = {
  validator: {
    $jsonSchema: {
      required: ['name', 'originalFilename', 'mimetype', 'fileSize', 'filePath'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Filename is required and 200 characters max',
          maxLength: 200,
        },
        originalFilename: {
          bsonType: 'string',
          description: 'Original filename is required and 200 characters max',
        },
        mimetype: {
          bsonType: 'string',
          description: 'File mimetype is required',
          maxLength: 2000,
        },
        fileSize: {
          bsonType: 'int',
          description: 'File size is required',
        },
        filePath: {
          bsonType: 'string',
          description: 'File path is required',
          maxLength: 2000,
        },
      },
    },
  },
}

const defaultSchema = {
  validator: {
    $jsonSchema: {
      required: ['name'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Product name is required and 50 characters max',
          maxLength: 200,
        },
        slug: {
          bsonType: 'string',
          description: 'Product slug is required',
        },
        description: {
          bsonType: 'string',
          description: 'Product description',
          maxLength: 2000,
        },
        sortOrder: {
          bsonType: 'int',
        },
      },
    },
  },
}

const productSchema = {
  validator: {
    $jsonSchema: {
      required: ['name', 'slug', 'acsPartNumber'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Product name is required and 50 characters max',
          maxLength: 50,
        },
        slug: {
          bsonType: 'string',
          description: 'Product slug is required',
        },
        description: {
          bsonType: 'string',
          description: 'Product description',
          maxLength: 2000,
        },
        media: {
          bsonType: 'array',
          description: 'Product images',
          uniqueItems: true,
          items: {
            bsonType: 'objectId',
          },
        },
        acsPartNumber: {
          bsonType: 'string',
          description: 'ACS part Number is required',
          maxLength: 20,
        },
        oemPartNumber: {
          bsonType: 'objectId',
          description: 'OEM part Number',
          maxLength: 20,
        },
        oem: {
          bsonType: 'objectId',
          description: 'OEM',
          maxLength: 20,
        },
        tbq: {
          bsonType: 'bool',
          description: 'Whether the product is to be quoted or not',
        },
        eligibilities: {
          bsonType: 'array',
          description: 'Product eligibilities',
          uniqueItems: true,
          items: {
            bsonType: 'objectId',
          },
        },
        // categories: {
        //   bsonType: 'array',
        //   description: 'Product categories',
        //   uniqueItems: true,
        // },
        nextHigherAssemblies: {
          bsonType: 'array',
          description: 'Product nextHigherAssemblies',
          uniqueItems: true,
          items: {
            bsonType: 'objectId',
          },
        },
        price: {
          bsonType: 'number',
          description: 'Product price',
          maxLength: 500,
        },
        salePrice: {
          bsonType: 'number',
          description: 'Product sale price',
        },
        sortOrder: {
          bsonType: 'int',
        },
      },
    },
  },
}

const galleriesSchema = {
  validator: {
    $jsonSchema: {
      required: ['name'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Gallery name is required and 50 characters max',
          maxLength: 200,
        },
        slug: {
          bsonType: 'string',
          description: 'Gallery slug',
        },
        description: {
          bsonType: 'string',
          description: 'Gallery description',
          maxLength: 2000,
        },
        media: {
          bsonType: 'array',
          description: 'Gallery images',
          uniqueItems: true,
          items: {
            bsonType: 'objectId',
          },
        },
        sortOrder: {
          bsonType: 'int',
        },
      },
    },
  },
}

export { mediaSchema, defaultSchema, productSchema, galleriesSchema }
