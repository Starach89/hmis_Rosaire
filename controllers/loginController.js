const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserModel = require('../models/userModel')
const AccessLogModel = require('../models/accessLogModel')
const { format } = require('date-fns')

////////////////////  ENVIRONMENT VARIABLES ////////////////////////////////
require('dotenv').config()
const NODE_SERVER_ACCESS_TOKEN_SECRET =
	process.env.NODE_SERVER_ACCESS_TOKEN_SECRET

//====================== CURRENT USER AND DATE STAMP ==========================
//const currentUser = 'default'
const currentDate = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`
//=============================================================================

exports.userLogin = async (req, res, next) => {
	//////////////////////////PREVALIDATION //////////////////////

	const { login, password } = req.body

	if (!login || !password) {
		return res.status(404).json({
			Message: 'Please fill in all required fields.',
			login: req.body.login,
			//password: req.body.password,
		})
	} else {
		//////////////////////////////// CHECK IF USER EXISTS ///////////////////////

		await UserModel.findOne({ login: login }) //incoming password is not hashed so cannot be used for $and
			.exec()
			.then((result) => {
				bcrypt.compare(password, result.password, (err, bcryptResult) => {
					if (err) {
						return res.status(401).json({
							message: 'Authentication failed',
						})
					} else if (!bcryptResult) {
						res.status(401).json({
							message: 'Authentication failed',
						})
					} else {
						///////////////////////// USER ROLES //////////////////////////
						let accessPrivilege = null
						if (
							result.accessPrivilege === undefined ||
							result.accessPrivilege === '' ||
							result.accessPrivilege === null
						) {
							accessPrivilege = null
						} else {
							//const accessPrivilege = Object.values(result.accessPrivilege)
							accessPrivilege = result.accessPrivilege
						}

						const accessToken = jwt.sign(
							{
								userid: result._id,
								username: result.username,
								usersurname: result.usersurname,
								jobtitle: result.jobtitle,
								speciality: result.speciality,
								department: result.department,
								accessPrivilege: accessPrivilege,
								uniqueSequence: Math.round(Math.random() * 1e9),
								accessStatus: 'Logged-in',
								lastLogin: currentDate,
							},
							NODE_SERVER_ACCESS_TOKEN_SECRET,
							{
								expiresIn: '8h', // 15 minutes
								//expiresIn: '60s',
							}
						)

						////////////////////////////////////////////////////////////
						UserModel.updateOne(
							{ _id: result.id },
							{
								$set: {
									accessStatus: 'logged-in',
									lastLogin: currentDate,
								},
							}
						)
							.then((result) => {
								// res.status(200).json({
								// 	message: 'RefreshToken update successfully',
								// })
							})
							.catch((err) => {
								return res.status(500).json({
									myError: 'RefreshToken update failed',
								})
							})
						///////////////////////////////////////////////////////

						/////////////////////////////////////////////////////
						const accessLogObject = new AccessLogModel({
							_id: new mongoose.Types.ObjectId(),
							userid: result._id,
							username: result.username,
							usersurname: result.usersurname,
							jobtitle: result.jobtitle,
							speciality: result.speciality,
							department: result.department,
							accessPrivilege: accessPrivilege,
							accessStatus: 'Logged-in',
							activityLog: currentDate,
						})

						accessLogObject
							.save()
							.then((result) => {
								// res.status(201).json({
								// 	message: `Login Successful`,
								// })
							})
							.catch((err) => {
								console.log(err)
								// res.status(500).json({
								// 	myError: 'Login Failed. ' + err.message,
								// })
							})
						//////////////////////////////////////////////////////

						res.status(201).json({
							accessToken: accessToken,
						})
					}
				})
			})
			.catch((err) => {
				res.status(401).json({
					message: 'Authentication Failed',
				})
			})
	}
}
