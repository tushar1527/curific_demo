import express from 'express';

import { fileUpload } from '../utils';

const upload = (req, res) => {
	let text = req.file.path;
	const filepath = text.split('public')[1];
	res.status(200).send({
		success: true,
		msg: 'File uploaded successfully',
		file: filepath,
	});
};

const router = express.Router();
router.post(
	'/upload',
	fileUpload.upload.single('file'),

	upload,
);

module.exports = router;
