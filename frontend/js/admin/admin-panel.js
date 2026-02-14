const cardWrapper = document.querySelector('.products')
const productsCount = document.querySelector('.products__count')
const logoutBtn = document.querySelector('.header__navlinks__logout')

logoutBtn.addEventListener('click', () => {
	const state = confirm('Are sure log out?')
	if (state) {
		window.location = '../../pages/admin/admin-login.html'
	}
})

async function renderProducts() {
	try {
		const data = await fetch(
			'https://exclusive-shop-yisx.vercel.app/admin/all-products',
		).then(product => product.json())

		productsCount.innerHTML = `(${data.length})`

		data.map(product => {
			const divEl = document.createElement('div')
			divEl.classList.add('card')
			divEl.innerHTML = `
				<div class="img-box">
					<img src="${product.image}" alt="${product.title}">
				</div>

				<div class="card__btns">
					<button class="card__delete__btn">Delete</button>
					<button class="card__edit__btn">Edit</button>
				</div>

				<h3>Gucci duffle bag</h3>
				<div class="price">
					<span class="new">$ ${product.currentPrice}</span>
					<span class="old">$ ${product.oldPrice}</span>
				</div>
			`

			cardWrapper.append(divEl)
		})
	} catch (error) {
		console.log(error)
	}
}

renderProducts()
