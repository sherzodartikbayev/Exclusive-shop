const { Schema, model } = require('mongoose')

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		isVerified: { type: Boolean, default: false },
		isAdmin: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
)

module.exports = model('user', userSchema)
