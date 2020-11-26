require('dotenv').config();
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

module.exports = function HandleForm(req, res) {
	const body = req.body,
		{ name, email, phone, message } = body;

	const mailOptions = {
		from: `${email}`,
		to: 'troy@rawmuscle.com.au',
		cc: 'tdkpty@yahoo.com',
		subject: 'Contact Form Raw Muscle Website',
		html: `
        <p>From: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>${message.replace(/\n+/g, '</p><p>')}</p>
        `,
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log('Failed to send email');
		} else {
			console.log(`Email sent: ${info.response}`);
			handleSent = true;
			handleStatus();
		}
	});
};
