import mongoose from 'mongoose'
// import jwt from 'jsonwebtoken'
// import crypto from 'crypto'
// import bcrypt from 'bcryptjs'

interface IUser {
	_id: mongoose.Types.ObjectId
	id: mongoose.Types.ObjectId
	name: string
	email: string
	// title: string
	userAddresses: Array<mongoose.Types.ObjectId>
	// billingAddress: mongoose.Types.ObjectId
	// phoneNumbers: Array<mongoose.Types.ObjectId>
	description: string
	sortOrder: number
	parent: mongoose.Types.ObjectId
	gallery: Array<mongoose.Types.ObjectId>
	role: String
	password: unknown
	// passwordConfirm: string
	active: boolean
	verified: boolean
	deliveryInstructions: string
	passwordResetToken: unknown
	passwordResetExpires: unknown
	passwordChangeDate: number
	createdAt: Date
	updatedAt: Date
	getSinedJwtToken(): Promise<string>
	createPasswordResetToken(): Promise<string>
	checkPassword(password: string, hash: string): Promise<boolean>
	hasPasswordChanged(JWTTimestamp: number): Promise<boolean>
}

const schema = new mongoose.Schema<IUser>(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			maxlength: [100, 'Name cannot be more than 50 characters long'],
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			lowercase: true,
			required: [true, 'Email is required'],
			match: [
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please enter a valid email address',
			],
		},
		// title: {
		//   type: String,
		//   trim: true,
		//   maxlength: [20, 'Title cannot be more than 20 characters long'],
		// },
		userAddresses: [{ type: mongoose.Types.ObjectId, ref: 'Useraddress' }],
		// billingAddress: { type: mongoose.Types.ObjectId, ref: 'Billinggaddress' },
		// phoneNumbers: [{ type: mongoose.Types.ObjectId, ref: 'Phonenumber' }],
		gallery: [{ type: mongoose.Types.ObjectId, ref: 'Media' }],
		role: {
			type: String,
			enum: ['admin', 'shop-manager', 'customer', 'user'],
			default: 'user',
		},
		password: {
			type: String,
			required: [true, 'Pasword is required'],
			minlength: [8, 'Password must contain at least 8 charcaters'],
			select: false,
		},
		// passwordConfirm: {
		//   type: String,
		//   validate: {
		//     // Only works on save()/create()
		//     validator: function (val: string) {
		//       return val === this.password
		//     },
		//     message: 'Passwords dont match',
		//   },
		// },
		active: {
			type: Boolean,
			default: false,
			// select: false,
		},
		verified: {
			type: Boolean,
			default: false,
			// select: false,
		},
		// deliveryInstructions: {
		//   type: String,
		//   maxlength: [2000, '2000 characters maximum'],
		// },
		passwordResetToken: String,
		passwordResetExpires: Date,
		passwordChangeDate: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

// Document Middleware, runs before save() and create()
// schema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next()
//   const salt = await bcrypt.genSalt(12)
//   this.password = await bcrypt.hash(this.password as string, salt)
//   return next()
// })

// schema.pre('save', async function (next) {
//   if (!this.isModified('password') || this.isNew) return next()
//   this.passwordChangeDate = Date.now() - 1000
//   next()
// })

// schema.methods.getSinedJwtToken = async function () {
//   if (process.env.JWT_SECRET)
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
// }

// schema.methods.checkPassword = async function (password: string, hash: string) {
//   return await bcrypt.compare(password, hash)
// }

// schema.methods.hasPasswordChanged = async function (JWTTimestamp: number) {
//   if (this.passwordChangeDate) {
//     return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
//   }
//   return false
// }

// schema.methods.createPasswordResetToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString('hex')
//   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
//   this.passwordResetExpires = Date.now() + Number(process.env.PW_RESET_TOKEN_EXPIRESIN) * 60 * 1000
//   return resetToken
// }

schema.pre(/^find/, function (next) {
	this.populate({
		path: 'gallery',
		// select: 'name slug',
	})
	this.populate({
		path: 'userAddresses',
		// select: 'name slug path url mimetype',
	})

	next()
})

const User = mongoose.model<IUser>('User', schema)
export { User, IUser }
