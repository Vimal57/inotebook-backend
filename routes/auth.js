const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const USER_SECRET = 'usersecret';
const isLoggedIn = require("../middleware/isLoggedIn");

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
			console.log('User Create Function Called');
			// validate data
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			// check if email exist or not in database
			let user = await User.findOne({ email: req.body.email });
			if (user) {
				return res.status(200).json({
					msg: 'User already exist!',
					data: user,
				});
			}

			// creating salt
			let salt = await bcrypt.genSalt(10);
			let secretPass = await bcrypt.hash(req.body.password, salt);

			// creating new user
			let newUser = await User.create({
				name: req.body.name,
				email: req.body.email,
				password: secretPass,
			});
			await newUser.save();

			const data = {
				user: {
					id: newUser.id,
				},
			};
			const authToken = jwt.sign(data, USER_SECRET);

			// return success
			return res.status(200).json({
				msg: 'User created successfully',
				data: {authToken},
			});
		} catch (error) {
			console.log('error :: ', error);
			return res.status(400).json({
				msg: 'something went wrong',
				err: error,
			});
		}
	}
);

// login user
router.post(
	'/login',
	[
		body('email', 'Enter valid email').isEmail(),
		body('password', 'Password can not be blank').exists(),
	],
	async (req, res) => {
		try {
			console.log('User Login Function Called');
			// validate data
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			// get data from body
			let { email, password } = req.body;

			// check if email exist or not in database
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(200).json({
					msg: 'User Does Not Exist!',
					data: {},
				});
			}

			// comapre password
			const comaparePass = await bcrypt.compare(password, user.password);

			// if password not valid
			if (!comaparePass) {
				return res.status(200).json({
					msg: 'Incorrect Password!',
					data: {},
				});
			}

			// creating token
			const jwtUserData = {
				user: {
					id: user.id,
				},
			};
			const authToken = jwt.sign(jwtUserData, USER_SECRET);

			// return success
			return res.status(200).json({
				msg: 'User Logged IN successfully',
				data: {authToken},
			});
		} catch (error) {
			console.log('error :: ', error);
			return res.status(400).json({
				msg: 'something went wrong',
				err: error,
			});
		}
	}
);

// get user
router.get(
	'/get',
	isLoggedIn,
	async (req, res) => {
		try {
			console.log('User Login Function Called');
			
			// return success
			return res.status(200).json({
				msg: 'User Found Successfully...',
				data: req.me,
			});
		} catch (error) {
			console.log('error :: ', error);
			return res.status(400).json({
				msg: 'something went wrong',
				err: error,
			});
		}
	}
);

module.exports = router;
