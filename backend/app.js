require('dotenv').config()

const express = require('express')
const { default: mongoose } = require('mongoose')
const session = require('express-session')
const errorMiddleware = require('./middlewares/error.middleware')
const cors = require('cors')

const app = express()

// Middlewares
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
)
app.use(express.json())
app.use(
	session({
		secret: process.env.SECRET_KEY,
		saveUninitialized: false,
		resave: false,
		cookie: {
			secure: false,
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 24 * 60 * 60 * 1000,
		},
	}),
)

// Routes
app.use('/auth', require('./routes/auth.route'))
app.use('/admin', require('./routes/admin.route'))

app.use(errorMiddleware)

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
