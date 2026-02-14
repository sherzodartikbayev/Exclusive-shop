const form = document.querySelector('.adminLog__form')
const email = document.querySelector('#admin__email')
const password = document.querySelector('#admin__password')
const btn = document.querySelector('.adminLog__btn')

form.addEventListener('submit', e => {
	e.preventDefault()

	const data = {
		email: email.value,
		password: password.value,
	}
	console.log(data)

	loginAdmin(data)
})

async function loginAdmin(data) {
	try {
		btn.textContent = state = 'Loading...'

		const req = await fetch(
			'https://exclusive-shop-yisx.vercel.app/admin/login',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			},
		)

		if (req.ok) {
			alert('You successfully log in!')
			window.location = '../../pages/admin/admin panel.html'
		}

		if (req.status === 404) {
			alert('Admin not found!')
			window.location = '../../pages/admin/admin-login.html'
		}

		if (req.status === 400) {
			alert('Password is incorrect!')
			window.location = '../../pages/admin/admin-login.html'
		}
	} catch (error) {
		console.log(error)
	} finally {
		form.reset()
		btn.textContent = state = 'Submit'
	}
}
