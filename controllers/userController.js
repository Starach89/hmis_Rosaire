const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const { format } = require('date-fns')
const bcrypt = require('bcrypt')
const SaltRounds = 10
ObjectId = mongoose.Types.ObjectId

const UserModel = require('../models/userModel')

/////////////////////////////  ENVIRONMENT VARIABLES ///////////////////////////
require('dotenv').config()
const NODE_SERVER_PROTOCOL = process.env.NODE_SERVER_PROTOCOL
const NODE_SERVER_IP = process.env.NODE_SERVER_IP
const NODE_SERVER_PORT = process.env.NODE_SERVER_PORT

const NODE_SERVER_ADDRESS =
	NODE_SERVER_PROTOCOL + '://' + NODE_SERVER_IP + ':' + NODE_SERVER_PORT + '/'
////////////////////////////////////////////////////////////////////////////////

//====================== CURRENT USER AND DATE STAMP ==========================
const currentDate = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`
//=============================================================================

function isValidObjectId(id) {
	if (ObjectId.isValid(id)) {
		if (String(new ObjectId(id)) === id) return true
		return false
	}
	return false
}
////////////////////////////////////////////////////////////////////////////////

exports.user_post = async (req, res, next) => {
	////////////////////////////// PREVALIDATION //////////////////////////////
	const {
		currentUserId,
		username,
		usersurname,
		gender,
		jobtitle,
		speciality,
		department,
		login,
		password,
		accessPrivilege,
	} = req.body

	if (
		!currentUserId ||
		!username ||
		!usersurname ||
		!gender ||
		!jobtitle ||
		!speciality ||
		!department ||
		!login ||
		!password ||
		!accessPrivilege
	) {
		return res.status(404).json({
			Message: 'Please fill in all required fields.',
		})
	} else {
		await UserModel.findOne({ login: login }) // check the syntax for AND operator in query
			.exec()
			.then((result) => {
				if (result !== null) {
					return res.status(409).json({
						message: 'User already exists!',
					})
				} else {
					///////////////////// PASSWORD ENCRYPTION ////////////////////////
					bcrypt.hash(password, SaltRounds, (err, hashedPassword) => {
						if (err) {
							return res.status(500).json({
								myError: 'hashing failed ' + err,
							})
						} else {
							const userObject = new UserModel({
								_id: new mongoose.Types.ObjectId(),
								username: username,
								usersurname: usersurname,
								gender: gender,
								jobtitle: jobtitle,
								speciality: speciality,
								department: department,
								login: login,
								password: hashedPassword,
								accessPrivilege: accessPrivilege,
								created_at: currentDate,
								created_by: currentUserId,
								updated_at: currentDate,
								updated_by: currentUserId,
							})

							userObject
								.save()
								.then((result) => {
									res.status(201).json({
										message: `User: ${result.username} Create Successfully`,
									})
								})
								.catch((err) => {
									console.log(err)
									res.status(500).json({
										myError: 'User Creation Failed. ' + err.message,
									})
								})
						}
					})
				}
			})
	}
}

exports.user_get_all = async (req, res, next) => {
	await UserModel.find()
		.select(
			'_id username usersurname gender jobtitle speciality department login password accessPrivilege accessStatus created_at created_by updated_at updated_by'
		)
		.then((document) => {
			const response = {
				count: document.length,
				users: document.map((documentItem) => {
					return {
						_id: documentItem._id,
						username: documentItem.username,
						usersurname: documentItem.usersurname,
						gender: documentItem.gender,
						jobtitle: documentItem.jobtitle,
						speciality: documentItem.speciality,
						department: documentItem.department,
						login: documentItem.login,
						password: documentItem.password,
						accessPrivilege: documentItem.accessPrivilege,
						accessStatus: documentItem.accessStatus,
						created_at: documentItem.created_at,
						created_by: documentItem.created_by,
						updated_at: documentItem.updated_at,
						updated_by: documentItem.updated_by,
						request: {
							type: 'GET',
							description: 'View Details',
							url: NODE_SERVER_ADDRESS + 'users/' + documentItem._id,
						},
					}
				}),
			}
			if (document.length > 0) {
				res.status(200).json(response)
			} else {
				res.status(404).json(response) // Empty Dbase does not count as not found (ie 404)
			}
		})
		.catch((err) => {
			res.status(500).json({
				myError: err,
			})
		})
}

exports.user_get_one = async (req, res, next) => {
	const id = req.params.id

	if (isValidObjectId(id)) {
		await UserModel.findById(id)
			.select(
				'_id username usersurname gender jobtitle speciality department login password accessPrivilege accessStatus created_at created_by updated_at updated_by'
			)
			.exec()
			.then((document) => {
				if (!document) {
					return res
						.status(404)
						.json({ Message: 'No valid response for given ID' })
				} else {
					res.status(200).json({
						user: {
							id: document._id,
							username: document.username,
							usersurname: document.usersurname,
							gender: document.gender,
							jobtitle: document.jobtitle,
							speciality: document.speciality,
							department: document.department,
							login: document.login,
							password: document.password,
							accessPrivilege: document.accessPrivilege,
							accessStatus: document.accessStatus,

							created_at: document.created_at,
							created_by: document.created_by,
							updated_at: document.updated_at,
							updated_by: document.updated_by,
						},
						request: {
							type: 'PATCH',
							description: 'Update Information',
							url: NODE_SERVER_ADDRESS + 'users/' + document._id,
						},
					})
				}
			})
			.catch((err) => {
				console.log(err)
				res.status(500).json({ myError: err })
			})
	} else {
		return res.status(404).json({ Message: 'No valid response for given ID' })
	}
}

exports.user_patch = async (req, res, next) => {
	const id = req.params.id
	const {
		currentUserId,
		username,
		usersurname,
		gender,
		jobtitle,
		speciality,
		department,
		login,
		password,
		accessPrivilege,
	} = req.body

	if (
		!currentUserId ||
		!username ||
		!usersurname ||
		!gender ||
		!jobtitle ||
		!speciality ||
		!department ||
		!login ||
		!password ||
		!accessPrivilege
	) {
		return res.status(404).json({
			Message: 'Please fill in all required fields.',
		})
	} else if (!isValidObjectId(id)) {
		return res.status(404).json({ Message: 'No valid response for given ID' })
	} else {
		userData = await UserModel.findOne({ _id: id })
			.exec()
			.then((document) => {
				if (!document) {
					return res
						.status(404)
						.json({ Message: 'No valid response for given ID' })
				} else {
					//////////////////////////////////////////////////////////////////////
					UserModel.updateOne(
						{ _id: id },
						{
							$set: {
								username: req.body.username,
								usersurname: req.body.usersurname,
								gender: req.body.gender,
								jobtitle: req.body.jobtitle,
								speciality: req.body.speciality,
								department: req.body.department,
								login: req.body.login,
								password: req.body.password,
								accessPrivilege: req.body.accessPrivilege,
								accessStatus: req.body.accessStatus,

								updated_at: currentDate,
								updated_by: currentUserId,
							},
						}
					)
						.then((result) => {
							res.status(200).json({
								message: 'Update Successfully',
								request: {
									type: 'GET',
									description: 'Get Users',
									url: NODE_SERVER_ADDRESS + 'users',
								},
							})
						})
						.catch((err) => {
							res.status(500).json({
								myError: 'Update Failed', //////
							})
						})
					/////////////////////////////////////////////////////////////////////
				}
			})
			.catch((err) => {
				res.status(500).json({
					myError: err,
				})
			})
	}
}

exports.user_delete = async (req, res, next) => {
	const id = req.params.id

	if (!isValidObjectId(id)) {
		return res.status(404).json({ Message: 'No valid response for given ID' })
	} else {
		UserModel.deleteOne({ _id: id })
			.exec()
			.then((result) => {
				if (result.acknowledged === true && result.deletedCount === 1) {
					res.status(200).json({
						message: 'Delete Successful',
						request: {
							type: 'GET',
							description: 'Get all users',
							url: NODE_SERVER_ADDRESS + 'users',
						},
					})
				}
			})
			.catch((err) => {
				res.status(500).json({
					myError: 'No valid response for given ID',
				})
			})
	}
}
