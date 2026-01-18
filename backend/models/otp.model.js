const { Schema, model } = require('mongoose')

const otpSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		otpHash: { type: String, required: true },
		otpTires: { type: Number, default: 0 },
		otpLastSent: { type: Date, default: Date.now },
		otpExpiresAt: { type: Date },
	},
	{ timestamps: true },
)

module.exports = model('otp', otpSchema)
