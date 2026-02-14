const form = document.querySelector('#form')
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const registerBtn = document.querySelector('#register__btn')
const toggleHidePassword = document.querySelector('.password-hide-toggle')

form.addEventListener('submit', e => {
	e.preventDefault()

	const data = {
		name: name.value,
		email: email.value,
		password: password.value,
	}

	register(data)
})

async function register(data) {
	let state = 'Create Account'

	try {
		registerBtn.textContent = state = 'Loading...'

		const req = await fetch(
			'https://exclusive-shop-yisx.vercel.app/auth/register',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			},
		)

		if (req.ok) {
			window.location = '../../pages/auth/login.html'
			alert(
				'Your account has been successfully registered! We sent message for verify to your email. After verification you can login.',
			)
		}

		console.log(req.status, req.statusText)
	} catch (error) {
		console.log(error)
	} finally {
		form.reset()
		registerBtn.textContent = state = 'Create Account'
	}
}

toggleHidePassword.addEventListener('click', () => {
	const type = password.getAttribute('type')

	if (type === 'password') {
		password.setAttribute('type', 'text')
	} else {
		password.setAttribute('type', 'password')
	}
})
