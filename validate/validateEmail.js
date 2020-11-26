const dns = require('dns');
const validateEmail = (email) => {
	let error;
	if (!email.trim()) {
		error = 'Email required';
	} else if (
		!/^((".{0,62}")|([^. ]{1,64}))(\.((".+")|([^. ]+))){0,32}@[^. ]+(\.[^. ]{1,253}){0,127}$/i.test(
			email
		)
	) {
		error = 'Email invalid';
	} else {
		error = false;
	}
	dns.lookup(
		email.split('@')[email.split('@').length - 1],
		(err, addresses) => {
			if (!addresses || error || err) {
				return error;
			}
			return;
		}
	);
};

module.exports = validateEmail;
