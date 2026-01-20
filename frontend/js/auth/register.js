const form = document.querySelector('#form')
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')

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
	try {
		const req = await fetch(
			'https://exclusive-shop-yisx.vercel.app/auth/register',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			},
		)

		console.log(req.statusText)
	} catch (error) {
		console.log(error)
	}
}
