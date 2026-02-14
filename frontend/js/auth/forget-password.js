const form = document.querySelector('#form')
const email = document.querySelector('#email')
const submitBtn = document.querySelector('#submit__btn')

form.addEventListener('submit', e => {
	e.preventDefault()

	const data = {
		email: email.value,
	}
	console.log(data)

	sendOtp(data)
})

async function sendOtp(data) {
	let state = 'Submit'

	try {
		submitBtn.textContent = state = 'Loading...'

		const req = await fetch(
			'https://exclusive-shop-yisx.vercel.app/auth/send-otp',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(data),
			},
		)

		if (req.ok) {
			alert('OTP has been sent to your email. Please check your inbox!')
			window.location = '../../pages/auth/verify-otp.html'
		}

		console.log(req.status, req.statusText)
	} catch (error) {
		console.log(error)
	} finally {
		form.reset()
		submitBtn.textContent = state = 'Submit'
	}
}
