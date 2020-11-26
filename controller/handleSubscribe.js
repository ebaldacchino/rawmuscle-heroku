const mongoose = require('mongoose');

const EmailModel = mongoose.model(
	'Email',
	mongoose.Schema({
		email: {
			type: String,
			required: true,
		},
	})
);

const handleSubscribe = (req, res) => {
	const { email } = req.body;

	const subscribeEmail = new EmailModel({ email: email });

	EmailModel.exists({ email: email })
		.then((response) => response)
		.then((subscribedAlready) => {
			if (subscribedAlready) {
				console.log('Already subscribed!');
			} else {
				subscribeEmail
					.save()
					.then(() => {
						console.log(`Subscribed!`);
					})
					.catch(() => {
						return console.log(`Failed to subscribe!`);
					});
			}
		});
};

module.exports = handleSubscribe;
