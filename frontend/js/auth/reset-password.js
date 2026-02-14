const form = document.querySelector('#form')
const password = document.querySelector('#password')
const confirmPassword = document.querySelector('#confirm-password')
const submitBtn = document.querySelector('#submit__btn')

form.addEventListener('submit', e => {
	e.preventDefault()

	const data = {
		password: password.value,
		confirmPassword: confirmPassword.value,
	}
	console.log(data)

	resetPassword(data)
})

async function resetPassword(data) {
	let state = 'Submit'

	try {
		submitBtn.textContent = state = 'Loading...'

		const req = await fetch(
			'https://exclusive-shop-yisx.vercel.app/auth/reset-password',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(data),
			},
		)

		const reqJson = await req.json()

		if (req.ok) {
			alert('Password reset successfully. You can now log in!')
			window.location = '../../pages/auth/login.html'
		} else {
			alert(reqJson.message)
		}

		console.log(req.status, req.statusText)
	} catch (error) {
		console.log(error)
	} finally {
		form.reset()
		submitBtn.textContent = state = 'Submit'
	}
}
