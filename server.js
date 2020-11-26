require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const handleForm = require('./controller/handleForm');
const handleSubscribe = require('./controller/handleSubscribe');
const handleEvents = require('./controller/handleEvents');
const validateForm = require('./validate/validateForm');
const validateEmail = require('./validate/validateEmail');
const path = require('path');
const helmet = require('helmet');

app.use(cors());
app.use(bodyParser.json());
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Database Connected Successfully'))
	.catch((err) => console.log(err));

app.post('/dist/send', async (req, res) => {
	const errors = validateForm(req.body);
	if (Object.keys(errors).length > 0) {
		return res.status(400).json(errors);
	}
	handleForm(req, res);
	if (req.body.subscribe) {
		handleSubscribe(req, res);
	}
	return await res.status(201).json({});
});

app.post('/dist/subscribe', async (req, res) => {
	const error = validateEmail(req.body.email);
	if (error) {
		return res.status(400).json(error);
	}
	await handleSubscribe(req, res);
	return await res.status(201).json({});
});

app.get('/dist/events', async (req, res) => handleEvents(req, res));

app.get('/robots.txt', async (req, res) =>
	res.sendFile(path.join(__dirname + '/robots.txt'))
);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) =>
		res.sendFile(path.join(__dirname + '/client/build/index.html'))
	);
}

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port: ${port}`));
