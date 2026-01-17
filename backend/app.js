require('dotenv').config()
const express = require('express')
const { default: mongoose } = require('mongoose')

const app = express()

const PORT = process.env.PORT

async function bootstrap() {
	try {
		mongoose.connect(process.env.MONGODB_URI)
		console.log('Connected to DB!')

		app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
	} catch (error) {
		console.log(error)
	}
}

bootstrap()
