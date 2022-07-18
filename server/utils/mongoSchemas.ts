const userSchema = {
  validator: {
    $jsonSchema: {
      required: ['name', 'email', 'role', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'User name is required and 200 characters max',
          maxLength: 200,
        },
        email: {
          bsonType: 'string',
          description: 'User email is required and 200 characters max',
          pattern: '^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$',
        },
        userAddresses: {
          bsonType: 'array',
          description: 'User Addresses',
          required: ['addressLine1', 'city', 'state', 'postalCode', 'defaultShippingAddress', 'defaultBillingAddress'],
          properties: {
            title: {
              bsonType: 'string',
              description: 'User address title is required and 200 characters max',
              maxLength: 5,
            },
            company: {
              bsonType: 'string',
              description: 'User address company is required and 200 characters max',
              maxLength: 50,
            },
            name: {
              bsonType: 'string',
              description: 'User address name is required and 200 characters max',
              maxLength: 50,
            },
            addressLine1: {
              bsonType: 'string',
              description: 'User address line 1 is required and 200 characters max',
              maxLength: 100,
            },
            addressLine2: {
              bsonType: 'string',
              description: 'User address line 2 is required and 200 characters max',
              maxLength: 100,
            },
            city: {
              bsonType: 'string',
              description: 'User address city is required and 200 characters max',
              maxLength: 100,
            },
            state: {
              bsonType: 'objectId',
              description: 'User address state is required and 200 characters max',
              maxLength: 20,
            },
            postalCode: {
              bsonType: 'string',
              description: 'User address postal code is required and 200 characters max',
              maxLength: 100,
            },
            country: {
              bsonType: 'objectId',
              description: 'User address countryis required and 200 characters max',
              maxLength: 20,
            },
            addressType: {
              enum: ['Residential', 'Commercial'],
              description: 'Address type and is required',
            },
            defaultShippingAddress: {
              bsonType: 'bool',
              description: 'Default shipping addrreess',
            },
            defaultBillingAddress: {
              bsonType: 'bool',
              description: 'Default billing addrreess',
            },
            deliveryInstructions: {
              bsonType: 'string',
              description: 'Delivery instructions is required and 200 characters max',
              maxLength: 2000,
            },
            phonenumbers: {
              bsonType: 'array',
              description: 'User phonenumbers',
              required: ['phoneNumber', 'defaultPhone'],
              properties: {
                phoneType: {
                  bsonType: 'string',
                  description: 'User address title is required and 200 characters max',
                  maxLength: 5,
                },
                phoneCountryCode: {
                  bsonType: 'objectId',
                  description: 'phone country code is required and 200 characters max',
                  maxLength: 20,
                },
                phoneNumber: {
                  bsonType: 'string',
                  description: 'User phone number is required and 200 characters max',
                  maxLength: 50,
                },
                defaultPhone: {
                  bsonType: 'bool',
                  description: 'Default phone',
                },
              },
            },
          },
        },

        media: {
          bsonType: 'array',
          description: 'User gallery',
          uniqueItems: true,
          items: {
            bsonType: 'objectId',
          },
        },
        role: {
          enum: ['admin', 'shop-manager', 'customer', 'user'],
          description: 'User role and is required',
        },
        password: {
          bsonType: 'string',
          description: 'User password is required',
          minLength: 8,
          maxLength: 2000,
        },
        active: {
          bsonType: 'bool',
          description: 'Whether the user is active',
        },
        verified: {
          bsonType: 'bool',
          description: 'Whether the user is verified',
        },
        passwordResetToken: {
          bsonType: 'string',
          description: 'Password reset token',
        },
        passwordResetExpires: {
          bsonType: 'date',
          description: 'Password reset token expiry',
        },
        passwordChangeDate: {
          bsonType: 'date',
          description: 'Password change date',
        },
      },
    },
  },
}

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

const gallerySchema = {
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

const stateSchema = {
  validator: {
    $jsonSchema: {
      required: ['name', 'abbreviation'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'State name is required and 50 characters max',
          maxLength: 200,
        },
        abbreviation: {
          bsonType: 'string',
          description: 'state abbreviation',
        },
      },
    },
  },
}

const countrySchema = {
  validator: {
    $jsonSchema: {
      required: ['countryName', 'currencyCode'],
      properties: {
        countryName: {
          bsonType: 'string',
          description: 'Country name is required and 50 characters max',
          maxLength: 200,
        },
        countryCode: {
          bsonType: 'string',
          description: 'Country cose',
        },
        continentName: {
          bsonType: 'string',
          description: 'continent name',
          maxLength: 2000,
        },
        continentCode: {
          bsonType: 'string',
          description: 'Continent code',
          maxLength: 2000,
        },
        capitalName: {
          bsonType: 'string',
          description: 'Continent code',
          maxLength: 2000,
        },
        currencyCode: {
          bsonType: 'string',
          description: 'Continent code',
          maxLength: 2000,
        },
        phoneCode: {
          bsonType: 'string',
          description: 'Continent code',
        },
        threeLetterCountryCode: {
          bsonType: 'string',
          description: 'Continent code',
          maxLength: 2000,
        },
      },
    },
  },
}

export { userSchema, mediaSchema, defaultSchema, productSchema, gallerySchema, stateSchema, countrySchema }
