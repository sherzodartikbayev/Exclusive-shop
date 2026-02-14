const cardContainer = document.querySelector('.flash__card__box')

async function renderProducts() {
	try {
		const data = await fetch(
			'https://exclusive-shop-yisx.vercel.app/admin/all-products',
		).then(data => data.json())

		data.map(product => {
			const divEl = document.createElement('div')
			divEl.classList.add('flash__card')
			divEl.innerHTML = `
			<a href="./pages/product-detail.html">
				<div class="flash__card__top">
					<div class="flash__card__top__image">
									<img src="${product.image}" alt=${product.title} />
					</div>
								<p class="flash__card__sale">-40%</p>
								<img src="./images/flash/like.svg" alt="" class="flash__card__like" />
								<img src="./images/flash/eye.svg" alt="" class="flash__card__like" />
							</div>
					<div class="flash__card__data">
					<h4 class="flash__card__title">${product.title}</h4>
					<div class="flash__card__costBox">
						<p class="flash__card__cost">${product.oldPrice}</p>
						<p class="flash__card__cost">${product.currentPrice}</p>
					</div>
					<div class="flash__card__bottom">
						<img src="./images/flash/card star.svg" alt="" />
						<img src="./images/flash/card star.svg" alt="" />
						<img src="./images/flash/card star.svg" alt="" />
						<img src="./images/flash/card star.svg" alt="" />
						<img src="./images/flash/card star.svg" alt="" />
						<p class="card__rate">(${product.review})</p>
					</div>
				</div>
			</a>
		`

			cardContainer.append(divEl)
		})
	} catch (error) {
		console.log(error)
	}
}

renderProducts()
