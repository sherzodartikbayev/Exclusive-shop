const jwt = require('jsonwebtoken')

exports.signReset = payload => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' })
}

exports.verifyReset = token => {
	return jwt.verify(token, process.env.JWT_SECRET)
}
