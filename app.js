const API_KEY = 'b895d7fd6e0c40288f31e630b2766655'

const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'techcrunch';

window.addEventListener('load', async e => {
	updateNews();
	await updateSources();
	sourceSelector.value = defaultSource;

	sourceSelector.addEventListener('change', e => {
		updateNews(e.target.value);
		console.log(e.target.value)
	});

	if('serviceWorker' in navigator) {
		try {
			navigator.serviceWorker.register('./sw.js');
			console.log('SW Registered')
		}
		catch(err) {
			console.log('SW error')
		}
	}
})

async function updateSources() {
	const res = await fetch('https://newsapi.org/v2/sources?apiKey=' + API_KEY)
	const json = await res.json();

	sourceSelector.innerHTML = json.sources
		.map(src => `<option value="${src.id}"> ${src.name}</option>` )
		.join('\n');
}

async function updateNews( source = defaultSource ) {

	const res = await fetch('https://newsapi.org/v2/top-headlines?sources=' + source + '&apiKey=' + API_KEY);
	const json = await res.json();

	console.log(json.articles)
	main.innerHTML = json.articles.map(createArticle).join('\n');
}

createArticle = article => {
	// console.log(article.url)
	return `
		<div class="article">
			<a href="${article.url}">
				<h2>${article.title}</h2>
				<img src="${article.urlToImage}" alt="" />
				<p>${article.description}</p>
			</a>
		</div>`;
}