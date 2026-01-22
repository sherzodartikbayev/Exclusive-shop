const form = document.querySelector('#form')
const otp = document.querySelector('#otp')
const verifyBtn = document.querySelector('#verify__btn')

form.addEventListener('submit', e => {
	e.preventDefault()

	const data = {
		otp: otp.value,
	}
	console.log(data)

	verifyOtp(data)
})

async function verifyOtp(data) {
	let state = 'Verify'

	try {
		verifyBtn.textContent = state = 'Loading...'

		const req = await fetch('http://localhost:8080/auth/verify-otp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include', // SHU QATORNI QO'SHING
			body: JSON.stringify(data),
		})

		const resData = await req.json() // Serverdan kelgan xabarni o'qish uchun

		if (req.ok) {
			alert('OTP verified successfully. You can now reset your password.')
			window.location = '../../pages/auth/reset-password.html'
		} else {
			alert(resData.message) // "Session expired" kabi xatolarni ko'rsatadi
		}
	} catch (error) {
		console.log(error)
	} finally {
		form.reset()
		verifyBtn.textContent = state = 'Verify'
	}
}
