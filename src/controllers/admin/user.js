import { adminUserService } from '../../mongoServices';
import { adminUserModel } from '../../models';
import { CONSTANTS } from '../../constants';
import {
	errorLogger,
	hashPassword,
	comparePassword,
	jwtGenerate,
	generatePassword,
	fileUpload,
	SendEmail,
	otpGenerator,
} from '../../utils';
import { isValidObjectId } from 'mongoose';
const {
	RESPONSE_MESSAGE: { ADMIN_USER, FAILED_RESPONSE, INVALID_OBJECTID },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const adminUserCreate = async (req, res) => {
	try {
		const { email, name, profileImage } = req.body;
		const checkExistingUser = await adminUserService.userQuery({
			email,
			name,
			orQuery: true,
		});
		if (checkExistingUser) {
			throw new Error(ADMIN_USER.USER_AVAILABLE);
		}
		const passwordGenerate = generatePassword();
		const { hashedPassword, salt } = await hashPassword(passwordGenerate);
		const insetObj = {
			...req.body,
			hashedPassword,
			salt,
			isEnabled: true,
			profileImage,
		};

		const adminUserSave = new adminUserModel(insetObj);
		const saveResponse = await adminUserSave.save();
		if (saveResponse) {
			return res.status(SUCCESS).send({
				success: true,
				msg: ADMIN_USER.CREATE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(ADMIN_USER.CREATE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const adminUserLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const checkExistingUser = await adminUserService.userQuery({
			email,
			populate: true,
		});
		// check user is exist or not
		if (!checkExistingUser) {
			throw new Error(ADMIN_USER.NOT_ADMIN_USER);
		}
		// check user attribute
		if (
			checkExistingUser.isEnabled === false ||
			checkExistingUser.deletedAt != null
		) {
			throw new Error(ADMIN_USER.LOGIN_SUSPEND);
		}
		const verifyPassword = await comparePassword(
			password,
			checkExistingUser?.hashedPassword,
		);
		if (!verifyPassword) throw new Error('Email or Password is incorrect');

		const token = jwtGenerate(checkExistingUser?._id, process.env.JWT_EXPIRY);
		let data = {
			name: checkExistingUser.name,
			email: checkExistingUser.email,
			profile: checkExistingUser.profile,
			userId: checkExistingUser._id,
			token,
		};

		return res.status(200).send({
			success: true,
			data,
			msg: ` Login Successfully`,
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const adminUserList = async (req, res) => {
	try {
		const { data, totalCount } = await adminUserService.findAllQuery(req.query);
		if (data) {
			return res.status(SUCCESS).send({
				success: true,
				msg: ADMIN_USER.GET_SUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(ADMIN_USER.GET_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const adminUserUpdate = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALID_OBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMIN_USER.NOT_ADMIN_USER);

		if (
			data[0].role.name === 'SUPER_USER' ||
			data[0].role.name === 'DEVELOPER'
		) {
			throw new Error('Super User cannot update');
		} else {
			if (data[0].profileImage) {
				await fileUpload.removeFile(data[0].profileImage);
			}
			let update = { ...req.body };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error(ADMIN_USER.UPDATE_FAILED);
			return res.status(SUCCESS).json({
				success: true,
				message: ADMIN_USER.UPDATE_SUCCESS,
				data: [],
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const adminUserStatus = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALID_OBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMIN_USER.NOT_ADMIN_USER);

		if (data[0].role.name === 'SUPER_USER') {
			throw new Error('Super User cannot update');
		} else {
			let update = { isEnabled: data[0].isEnabled === true ? false : true };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error('status is not updated');
			return res.status(SUCCESS).send({
				success: true,
				msg: 'status update successfully',
				data: [],
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const adminUserDelete = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALID_OBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMIN_USER.NOT_ADMIN_USER);

		if (data[0].role === 'SUPER_USER') {
			throw new Error('Super User cannot update');
		} else {
			let update = { deletedAt: new Date() };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error('status is not updated');
			return res.status(SUCCESS).send({
				success: true,
				msg: 'User delete  successfully',
				data: [],
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const adminUserChangePassword = async (req, res) => {
	try {
		const {
			currentUser: { _id },
			body: { oldPassword, newPassword },
		} = req;

		let filter = { _id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMIN_USER.NOT_ADMIN_USER);

		const comparePass = await comparePassword(
			oldPassword,
			data[0].hashedPassword,
		);
		if (comparePass) {
			const { salt, hashedPassword } = await hashPassword(newPassword);
			let updateObj = {
				salt,
				hashedPassword,
				firstLogin: false,
			};
			const passwordChange = await adminUserService.updateOneQuery(
				filter,
				updateObj,
			);
			if (passwordChange) {
				res.status(SUCCESS).send({
					success: true,
					msg: ADMIN_USER.PASSWORD_CHANGED,
					data: [],
				});
			} else {
				throw new Error(ADMIN_USER.PASSWORD_NOT_CHANGED);
			}
		} else {
			throw new Error('Password is invalid');
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const checkExistingUser = await adminUserService.userQuery({
			email,
		});
		if (!checkExistingUser) {
			throw new Error(ADMIN_USER.USER_NOT_AVAILABLE);
		} else {
			let createOtp = otpGenerator();
			let filter = { email };
			let update = { otp: createOtp };
			await adminUserService.updateOneQuery(filter, update);
			await SendEmail.sendForgetPasswordEmail(
				email,
				createOtp,
				checkExistingUser.firstName,
			);
			return res.status(SUCCESS).send({
				success: true,
				msg: 'Forget password Email  send successfully',
				data: [],
				otp: createOtp,
			});
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const resetPassword = async (req, res) => {
	try {
		const { email, newPassword, otp } = req.body;

		const checkExistingUser = await adminUserService.userQuery({
			email,
			otp,
		});
		if (!checkExistingUser) {
			throw new Error(ADMIN_USER.USER_NOT_AVAILABLE);
		} else {
			let filter = { email };
			const { salt, hashedPassword } = await hashPassword(newPassword);
			let update = {
				salt,
				hashedPassword,
				firstLogin: false,
			};
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (updateAdminUser) {
				return res.status(SUCCESS).json({
					success: true,
					msg: 'password change successfully',
				});
			} else {
				throw new Error('password changing failed');
			}
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
export default {
	adminUserCreate,
	adminUserLogin,
	adminUserList,
	adminUserUpdate,
	adminUserStatus,
	adminUserDelete,
	adminUserChangePassword,
	forgetPassword,
	resetPassword,
};
