const request = require('request');
const cheerio = require('cheerio');

const handleEvents = async (req, res) => {
	request(
		'https://www.eventbrite.com.au/o/raw-muscle-30390508778',
		(error, response, html) => {
			if (!error && response.statusCode == 200) {
				const $ = cheerio.load(html);

				const dates = $(
					'.eds-text-color--primary-brand.eds-l-pad-bot-1.eds-text-weight--heavy.eds-text-bs'
				)
					.text()
					.split(', ')
					.filter((e, i) => i % 2 !== 0);

				const towns = $('.card-text--truncated__one')
					.text()
					.split(' • ')
					.filter((e, i) => i % 2 === 0);

				const states = towns.map((town) =>
					town.split(', ').length === 1 ? 'NZ' : town.split(', ')[1]
				);

				let events = [];
				const links = $('.eds-event-card-content__action-link');
				for (let i = 0; i < dates.length; i++) {
					events.push({
						date: dates[i],
						town: towns[i].split(', ')[0],
						state: states[i],
						url: links[i * 2]['attribs']['href'],
					});
				}

				return res.status(201).json({ events: events });
			}
		}
	);
};

module.exports = handleEvents;
