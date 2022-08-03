const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');
const isLoggedIn = require('../middleware/isLoggedIn');

// get all notes
router.get('/get', isLoggedIn, async function (req, res) {
	try {
		// get data from req obj
		let user = req.me;

		// check if user exist or not
		let userData = await User.findOne({ id: user.id });
		if (!userData) {
			return res.status(200).json({
				msg: 'User Not Exist!',
				data: {},
			});
		}

		// get notes for that user
		const notes = await Note.find({ user: user.id });

		// return success
		return res.status(200).json({
			msg: 'Notes Found Successfully...',
			data: notes,
		});
	} catch (error) {
		console.log('error :: ', error);
		return res.status(400).json({
			msg: 'something went wrong',
			err: error,
		});
	}
});

// create new note
router.post(
	'/create',
	isLoggedIn,
	[
		body('title', 'Enter valid title').isLength({ min: 3 }),
		body('description', 'Enter valid description').isLength({ min: 5 }),
	],
	async function (req, res) {
		try {
			// validate data
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			// get data from req obj
			let { title, description, tag } = req.body;
			let user = req.me;

			// check if user exist or not
			let userData = await User.findOne({ id: user.id });
			if (!userData) {
				return res.status(200).json({
					msg: 'User Not Exist!',
					data: {},
				});
			}

			// create note for that user
			const newNote = await Note.create({
				user: user.id,
				title,
				description,
				tag: tag ? tag : 'General',
			});
			await newNote.save();

			// return success
			return res.status(200).json({
				msg: 'New Note Created Successfully...',
				data: newNote,
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

// update note
router.post('/update/:id', isLoggedIn, async function (req, res) {
	try {
		// get data from req obj
		let id = req.params.id;
		let { title, description, tag } = req.body;
		let user = req.me;

		// check if user exist or not
		let userData = await User.findOne({ id: user.id });
		if (!userData) {
			return res.status(200).json({
				msg: 'User Not Exist!',
				data: {},
			});
		}

		// check if note exist or not
		let noteData = await Note.findOne({ id });
		if (!noteData) {
			return res.status(200).json({
				msg: 'Note Not Exist!',
				data: {},
			});
		}

		// update note for that user
		let newNote = {};
		if (title) {
			newNote.title = title;
		}
		if (description) {
			newNote.description = description;
		}
		if (tag) {
			newNote.tag = tag;
		}

		let updateNote = await Note.findOneAndUpdate(
			{ id, user: user.id },
			{ $set: newNote },
			{ new: true }
		);
		if (!updateNote) {
			return res.status(200).json({
				msg: 'Not Allowed!',
				data: {},
			});
		}

		// return success
		return res.status(200).json({
			msg: 'Note Updated Successfully...',
			data: updateNote,
		});
	} catch (error) {
		console.log('error :: ', error);
		return res.status(400).json({
			msg: 'something went wrong',
			err: error,
		});
	}
});

// delete note
router.post('/delete/:id', isLoggedIn, async function (req, res) {
	try {
		// get data from query
		let { id } = req.params;
		let user = req.me;

		// check if id exist or not
		if (!id) {
			return res.status(200).json({
				msg: 'Please provide a noteID!',
				data: {},
			});
		}

		// check if user exist or not
		let userData = await User.findOne({ id: user.id });
		if (!userData) {
			return res.status(200).json({
				msg: 'User Not Exist!',
				data: {},
			});
		}

		// delete note for that user
		await Note.findOneAndDelete({ _id: id });
		let notes = await Note.find({ user: userData._id });

		// return success
		return res.status(200).json({
			msg: 'Note Deleted Successfully...',
			data: {notes},
		});
	} catch (error) {
		console.log('error :: ', error);
		return res.status(400).json({
			msg: 'something went wrong',
			err: error,
		});
	}
});

module.exports = router;
