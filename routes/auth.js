const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		let obj = {
			name: 'test',
		};

		res.status(200).json(obj);
	} catch (error) {
		console.log('error :: ', error);
	}
});

module.exports = router;
