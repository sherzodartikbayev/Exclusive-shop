const form = document.querySelector('#form')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const loginBtn = document.querySelector('#login__btn')
const toggleHidePassword = document.querySelector('.password-hide-toggle')

form.addEventListener('submit', e => {
	e.preventDefault()

	const data = {
		email: email.value,
		password: password.value,
	}

	login(data)
})

async function login(data) {
	let state = 'Log In'

	try {
		loginBtn.textContent = state = 'Loading...'

		const req = await fetch(
			'https://exclusive-shop-yisx.vercel.app/auth/login',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			},
		)

		if (req.ok) {
			alert('You successfully log in!')
			window.location = '/index.html'
		} else {
			alert('Something went wrong. Please try again!')
		}

		console.log(req.status, req.statusText)
	} catch (error) {
		console.log(error)
	} finally {
		form.reset()
		loginBtn.textContent = state = 'Log In'
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
