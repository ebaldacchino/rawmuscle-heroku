const dns = require('dns');

const validateForm = (body) => {
	const { name, email, phone, message } = body;
	let errors = {};

	if (!name.trim()) {
		errors.name = 'Name required';
	} else if (
		!/^[a-z\u00C0-\u00ff]+(([',. -][a-z\u00C0-\u00ff ])?[a-z\u00C0-\u00ff]*)*$/i.test(
			name.trim()
		)
	) {
		errors.name = 'Valid name required';
	}

	if (!email.trim()) {
		errors.email = 'Email required';
	} else if (
		!/^((".{0,62}")|([^. ]{1,64}))(\.((".+")|([^. ]+))){0,32}@[^. ]+(\.[^. ]{1,253}){0,127}$/i.test(
			email
		)
	) {
		errors.email = 'Email invalid';
	}

	const phoneTrim = phone.replace(/\D/g, '');
	if (!phoneTrim) {
		errors.phone = 'Phone required';
	} else if (
		!/^((((6[14]0?)|0)[0-9])?(\d{8})|((640?|0))(\d{6,7}))$/.test(phoneTrim)
	) {
		errors.phone = 'Phone invalid';
	}

	if (!message.trim()) {
		errors.message = 'Message required';
	} else if (message.trim().length < 3) {
		errors.message = 'Valid message required';
	}

	const emailDNS = dns.lookup(
		email.split('@')[email.split('@').length - 1],
		(err, addresses) => addresses && err
	).hostname;

	if (!emailDNS) errors.email = 'Email invalid';

	return errors;
};

module.exports = validateForm;
