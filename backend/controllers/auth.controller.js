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
			if (!email) {
				return res.status(401).json({ message: 'Email is required.' })
			}

			const user = await userModel.findOne({ email })
			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const existingOtp = await otpModel
				.findOne({ user: user._id })
				.sort({ createdAt: -1 })

			if (
				existingOtp &&
				existingOtp.otpLastSent &&
				Date.now() - existingOtp.otpLastSent.getTime() < 1 * 60 * 1000
			) {
				return res.status(400).json({
					message:
						'An OTP was already sent recently. Please wait 1 minute before requesting a new one.',
				})
			}

			const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
			const hashedOTP = await bcrypt.hash(otp, 10)

			const otpData = {
				user: user._id,
				otpHash: hashedOTP,
				otpTires: 0,
				otpLastSent: new Date(),
				otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
			}

			await otpModel.create(otpData)
			await sendOtpEmail(email, user.name, otp)

			req.session.uid = user._id
			return res.status(200).json({
				message: 'OTP has been sent to your email. Please check your inbox.',
			})
		} catch (error) {
			console.log(error)
		}
	}

	async verifyOtp(req, res) {
		try {
			const userId = req.session.uid
			if (!userId) {
				return res
					.status(400)
					.json({ message: 'Session expired. Please try again.' })
			}

			const otp = req.body.otp.trim()
			if (!otp) {
				return res.status(400).json({ message: 'OTP is required.' })
			}

			const user = await userModel.findById(userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const otpData = await otpModel
				.findOne({ user: userId })
				.sort({ createdAt: -1 })
			if (!otpData) {
				res.status(404).json({ message: 'No OTP found for this user.' })
			}

			if (otpData.otpExpiresAt < new Date()) {
				await otpModel.deleteMany({ user: userId })
				return res.status(401).json({
					message: 'OTP has expired. Please wait 1 minute for new one.',
				})
			}

			const isMatch = await bcrypt.compare(otp, otpData.otpHash)
			if (!isMatch) {
				otpData.otpTires += 1
				await otpData.save()

				if (otpData.otpTires >= 3) {
					await otpModel.deleteMany({ user: userId })
					return res
						.status(400)
						.json({ message: 'Too many attempts. Please request a new OTP.' })
				}

				return res
					.status(401)
					.json({ message: 'Invalid OTP. Please try again.' })
			}

			await otpModel.deleteMany({ user: userId })
			return res.status(200).json({
				message: 'OTP verified successfully. You can now reset your password.',
			})
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	}

	async resetPassword(req, res) {
		try {
			const userId = req.session.uid
			if (!userId) {
				return res
					.status(401)
					.json({ message: 'Session expired. Please try again.' })
			}

			const { password, confirmPassword } = req.body
			if (!password || !confirmPassword) {
				return res.status(400).json({ message: 'Both fields are required.' })
			}

			if (password !== confirmPassword) {
				return res.status(401).json({ message: 'Passwords do not match.' })
			}

			const user = await userModel.findById(userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			user.password = await bcrypt.hash(password, 10)
			await user.save()

			return res
				.status(200)
				.json({ message: 'Password reset successfully. You can now log in' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	}
}

module.exports = new AuthController()
