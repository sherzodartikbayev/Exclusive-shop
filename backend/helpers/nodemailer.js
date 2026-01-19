const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_NAME,
		pass: process.env.EMAIL_PASSWORD,
	},
})

exports.sendVerification = async (name, email, verifyLink) => {
	await transporter.sendMail({
		from: 'Exclusive-SHOP',
		to: email,
		subject: 'Email verification!',
		html: `
				<body style="font-family: Arial, sans-serif;">
					<h2>Verify Your Email</h2>
					<p>Hello, ${name}</p>
					<p>Click the link below to verify your account.</p>
					<p><a href=${verifyLink}>${verifyLink}</a></p>
					<p>If you didn't request this, please ignore this email.</p>
					<p>This link is valid for 10 minutes.</p>
				</body>
				`,
	})
}

exports.sendOtpEmail = async (email, name, otp) => {
	await transporter.sendMail({
		from: 'Exclusive-SHOP',
		to: email,
		subject: 'Your OTP Code!',
		html: `
				<body style="font-family: Arial, sans-serif;">
					<h2>Your OTP Code</h2>
					<p>Hello, ${name}</p>
					<p>Your OTP code is <strong>${otp}</strong>.</p>
					<p>Please use this code to reset your password.</p>
					<p>This code is valid for 10 minutes.</p>
				</body>
				`,
	})
}
