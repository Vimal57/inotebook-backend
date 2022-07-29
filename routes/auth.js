const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require("../models/User");

// create user
router.post(
	'/create',
	[
		body('name', 'Enter valid name').isLength({ min: 3 }),
		body('email', 'Enter valid email').isEmail(),
		body('password', 'Password must be atleast 4 characters').isLength({
			min: 4,
		}),
	],
	async (req, res) => {
		try {
			console.log("User Create Function Called");
			// validate data
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			// check if email exist or not in database
			let user = await User.findOne({ email: req.body.email });
			if (user) {
				return res.status(200).json({
					msg: "User already exist!",
					data: user,
				});
			}

			// creating new user
			let newUser = await User.create({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
			});
			await newUser.save();

			// return success
			return res.status(200).json({
				msg: "User created successfully",
				data: newUser,
			});
		} catch (error) {
			console.log('error :: ', error);
			return res.status(400).json({
				msg: "something went wrong",
				err: error,
			});
		}
	}
);

module.exports = router;
