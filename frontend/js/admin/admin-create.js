const form = document.querySelector('.form')
const createBtn = document.querySelector('.create')

const title = document.querySelector('#title')
const currentPrice = document.querySelector('#current-price')
const image = document.querySelector('#image')
const oldPrice = document.querySelector('#old-price')
const description = document.querySelector('#description')

const logoutBtn = document.querySelector('.header__navlinks__logout')

logoutBtn.addEventListener('click', () => {
	const state = confirm('Are sure log out?')
	if (state) {
		window.location = '../../pages/admin/admin-login.html'
	}
})

form.addEventListener('submit', e => {
	e.preventDefault()

	const productData = {
		title: title.value,
		image: image.value,
		currentPrice: currentPrice.value,
		oldPrice: oldPrice.value,
		description: description.value,
	}

	createProduct(productData)
})

async function createProduct(data) {
	try {
		createBtn.textContent = 'Loading...'

		const req = await fetch(
			'https://exclusive-shop-yisx.vercel.app/admin/product',
			{
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
				body: JSON.stringify(data),
			},
		)

		if (req.status === 201) {
			form.reset()
			alert('Your product successfully created!')
			createBtn.textContent = 'Create'
			window.location = '../../pages/admin/admin panel.html'
		}
	} catch (error) {
		console.log(error)
	}
}
