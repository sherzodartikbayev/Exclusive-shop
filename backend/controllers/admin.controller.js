const bcrypt = require('bcrypt')
const productModel = require('../models/product.model')
const userModel = require('../models/user.model')

class AdminController {
	async login(req, res) {
		try {
			const { email, password } = req.body

			const user = await userModel.findOne({ email })

			if (!user) {
				return res.status(404).json({ message: 'Admin not found' })
			}

			if (!user.isAdmin) {
				return res.status(400).json({ message: 'You are not admin' })
			}

			const correctPassword = await bcrypt.compare(password, user.password)

			if (!correctPassword) {
				return res.status(400).json({ message: 'Your password is incorrect' })
			}

			return res.status(200).json(user)
		} catch (error) {
			console.log(error)
		}
	}

	async getProducts(req, res) {
		try {
			const products = await productModel.find()
			return res.status(200).json(products)
		} catch (error) {
			console.log(error)
		}
	}

	async getProduct(req, res) {
		try {
			const { id } = req.params

			const product = await productModel.findById(id)

			if (!product) {
				return res.status(404).json({ message: 'Product not found!' })
			}

			return res.status(200).json(product)
		} catch (error) {
			console.log(error)
		}
	}

	async createProduct(req, res) {
		try {
			const {
				title,
				image,
				state,
				count,
				discount,
				oldPrice,
				currentPrice,
				review,
			} = req.body

			const newProduct = await productModel.create({
				title,
				image,
				state,
				count,
				discount,
				oldPrice,
				currentPrice,
				review,
			})

			return res.status(201).json(newProduct)
		} catch (error) {
			console.log(error)
		}
	}

	async editProduct(req, res) {
		try {
			const { id } = req.params
			const {
				title,
				image,
				state,
				count,
				discount,
				oldPrice,
				currentPrice,
				review,
			} = req.body

			const product = await productModel.findByIdAndUpdate(id, {
				title,
				image,
				state,
				count,
				discount,
				oldPrice,
				currentPrice,
				review,
			})

			if (!product) {
				return res.status(404).json({ message: 'Product not found' })
			}

			return res.status(200).json(product)
		} catch (error) {
			console.log(error)
		}
	}

	async deleteProduct(req, res) {
		try {
			const { id } = req.params

			const product = await productModel.findByIdAndDelete(id)

			return res.status(200).json(product)
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new AdminController()
