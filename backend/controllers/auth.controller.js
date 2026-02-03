const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const { signReset, verifyReset } = require('../utils/jwt')
const { sendVerification, sendOtpEmail } = require('../helpers/nodemailer')
const otpModel = require('../models/otp.model')

class AuthController {
	async login(req, res) {
		try {
			const { email, password } = req.body

			const user = await userModel.findOne({ email })
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			if (!user.isVerified) {
				return res.status(401).json({
					message:
						'User is not verified. Please verify your email before logging in.',
				})
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(401).json({ message: 'Invalid password' })
			}

			req.session.user = user
			return res.status(200).json(user)
		} catch (error) {
			console.log(error)
			return res
				.status(500)
				.json({ message: 'Login failed due to server error' })
		}
	}

	async register(req, res) {
		try {
			const { name, email, password } = req.body

			if (!name || !email || !password) {
				return res.status(400).json({ message: 'All fields are required.' })
			}

			const exist = await userModel.findOne({ email })
			if (exist) {
				return res.status(400).json({ message: 'Email is already exist' })
			}

			const hashedPassword = await bcrypt.hash(password, 10)

			const createdUser = await userModel.create({
				name,
				email: email.trim().toLowerCase(),
				password: hashedPassword,
			})

			const verifyToken = signReset({ userId: createdUser._id })
			const verifyLink = `${process.env.DOMAIN}/auth/verify/${verifyToken}`
			await sendVerification(name, email, verifyLink)

			return res.status(201).json(createdUser)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Server Error' })
		}
	}

	async verify(req, res) {
		try {
			const decoded = verifyReset(req.params.verifyToken)
			if (!decoded) {
				return res
					.status(401)
					.json({ message: 'Invalid or expired verification token.' })
			}

			const user = await userModel.findById(decoded.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			user.isVerified = true
			await user.save()

			return res.status(200).json({
				message:
					'Your account has been successfully verified! You can login now.',
			})
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Server Error' })
		}
	}

	logout(req, res) {
		try {
			req.session.destroy(() => {
				return res.status(200).json({ message: 'Logged out successfully.' })
			})
		} catch (error) {
			console.log(error)
		}
	}

	async sendOtp(req, res) {
		try {
			const email = req.body.email.trim().toLowerCase()
			if (!email) return res.status(400).json({ message: 'Email is required.' })

			const user = await userModel.findOne({ email })
			if (!user) return res.status(404).json({ message: 'User not found.' })

			const existingOtp = await otpModel
				.findOne({ user: user._id })
				.sort({ createdAt: -1 })

			if (
				existingOtp &&
				Date.now() - existingOtp.otpLastSent.getTime() < 1 * 60 * 1000
			) {
				return res.status(400).json({ message: 'Please wait 1 minute.' })
			}

			const otp = Math.floor(100000 + Math.random() * 900000).toString()
			const hashedOTP = await bcrypt.hash(otp, 10)

			await otpModel.create({
				user: user._id,
				otpHash: hashedOTP,
				otpLastSent: new Date(),
				otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
			})

			await sendOtpEmail(email, user.name, otp)

			// Sessiya shart emas, lekin xohlasangiz qoldirishingiz mumkin
			return res.status(200).json({ message: 'OTP sent successfully!' })
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
		}
	}

	async verifyOtp(req, res) {
		try {
			const { email, otp } = req.body

			const user = await userModel.findOne({
				email: email.trim().toLowerCase(),
			})

			if (!user) return res.status(404).json({ message: 'User not found.' })

			const otpData = await otpModel
				.findOne({ user: user._id })
				.sort({ createdAt: -1 })
			if (!otpData) return res.status(404).json({ message: 'No OTP found.' })

			if (otpData.otpExpiresAt < new Date()) {
				await otpModel.deleteMany({ user: user._id })
				return res.status(401).json({ message: 'OTP expired.' })
			}

			const isMatch = await bcrypt.compare(otp.trim(), otpData.otpHash)
			if (!isMatch) {
				otpData.otpTires += 1
				await otpData.save()
				return res.status(401).json({ message: 'Invalid OTP.' })
			}

			await otpModel.deleteMany({ user: user._id })
			return res.status(200).json({ message: 'OTP verified successfully.' })
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' })
		}
	}

	async resetPassword(req, res) {
		try {
			const { email, password, confirmPassword } = req.body

			if (password !== confirmPassword) {
				return res.status(400).json({ message: 'Passwords do not match.' })
			}

			const user = await userModel.findOne({
				email: email.trim().toLowerCase(),
			})
			if (!user) return res.status(404).json({ message: 'User not found' })

			user.password = await bcrypt.hash(password, 10)
			await user.save()

			return res.status(200).json({ message: 'Password reset successfully.' })
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' })
		}
	}
}

module.exports = new AuthController()
