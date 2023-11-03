(async function main() {
	const tableBody = document.querySelector('table').childNodes[1]
	const playerUrls = Array.from(tableBody.childNodes)
		.map(row => row.childNodes[1].childNodes[0].childNodes[1].href);
	const bornInPromises = playerUrls.map(url => {
		return fetch(url)
			.then(res => res.text())
			.then(body => {
				const newDOM = new DOMParser().parseFromString(body, 'text/html');
				return newDOM.querySelectorAll('.ds-text-tight-m.ds-font-regular.ds-uppercase.ds-text-typo-mid3')[1].nextSibling.textContent;
			})
			.catch(_err => 'ERROR');
	});
	const places = await Promise.all(bornInPromises);
	const states = places.map(place => place.split(',').at(-1).trim());
	console.log(states);
})()
