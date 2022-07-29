import multer from 'multer';
import fs, { unlinkSync } from 'fs';

require('dotenv').config({ path: '.env' });

// upload file path

const removeFile = (file) => {
	try {
		const deleteFile = `${process.env.FILE}/${file}`;
		unlinkSync(deleteFile, (err) => {
			throw new Error(err);
		});
		return removeFile;
	} catch (err) {
		return err;
	}
};

// configure multer storage
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		let path = `${process.env.FILE}/${_req.query.field}/`;
		fs.mkdirSync(path, { recursive: true });
		cb(null, path);
	},
	filename: (_req, file, cb) => {
		let filename = file.originalname;
		let fileExt = filename.split('.').pop();

		cb(null, Date.now() + '.' + fileExt);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (_req, file, cb) => {
		try {
			let error = 'Error: Allowed only .JPEG, .JPG, .PNG';
			const { mimetype } = file;
			if (
				mimetype == 'image/jpeg' ||
				mimetype === 'image/png' ||
				mimetype == 'image/jpg'
			) {
				cb(null, true);
			} else {
				cb(error, false);
			}
		} catch (error) {
			return cb(null, false);
		}
	},
});

export default { upload, storage, removeFile };
