const { Schema, model } = require('mongoose')

const productModel = new Schema(
	{
		title: { type: String, required: true },
		image: { type: String, required: true },
		state: { type: String },
		count: { type: Number, required: true, default: 1 },
		discount: { type: Number },
		oldPrice: { type: Number },
		currentPrice: { type: Number, required: true },
		review: { type: Number, required: true, default: 0 },
	},
	{
		timestamps: true,
	},
)

module.exports = model('product', productModel)
