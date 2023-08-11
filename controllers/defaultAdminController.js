const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const SaltRounds = 10
const { format } = require('date-fns')

const UserModel = require('../models/userModel')

/////////////////////////////  ENVIRONMENT VARIABLES ///////////////////////////
require('dotenv').config()

const ADMIN_LOGIN = process.env.DEFAULT_ADMIN_LOGIN

const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD

const ACCESS_LEVEL_ONE = process.env.ACCESS_LEVEL_ONE

const ACCESS_LEVEL_TWO = process.env.ACCESS_LEVEL_TWO

const ACCESS_LEVEL_THREE = process.env.ACCESS_LEVEL_THREE

const ACCESS_LEVEL_FOUR = process.env.ACCESS_LEVEL_FOUR

const ACCESS_LEVEL_FIVE = process.env.ACCESS_LEVEL_FIVE
//////////////////////////////////////////////////////////////////////////////

exports.user_post = async (req, res, next) => {
	//====================== CURRENT DATE STAMP ==========================
	const currentDate = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`
	//====================================================================

	////////////////////////////// CHECK DUPLICATE ////////////////////////////
	await UserModel.findOne({ login: ADMIN_LOGIN }) // check the syntax for AND operator in query
		.exec()
		.then((result) => {
			if (result !== null) {
				return res.status(409).json({
					message: 'SuperUser already exists!',
				})
			} else {
				///////////////////// PASSWORD ENCRYPTION ////////////////////////
				bcrypt.hash(ADMIN_PASSWORD, SaltRounds, (err, hashedPassword) => {
					if (err) {
						return res.status(500).json({
							myError: 'Hashing failed ' + err,
						})
					} else {
						//==============================================================
						userid = new mongoose.Types.ObjectId()

						const userObject = new UserModel({
							_id: userid,
							username: 'SuperUser',
							usersurname: 'System Administrator',
							gender: 'default',
							jobtitle: 'default',
							speciality: 'default',
							department: 'default',
							login: ADMIN_LOGIN,
							password: hashedPassword,
							accessPrivilege: [
								ACCESS_LEVEL_ONE,
								ACCESS_LEVEL_TWO,
								ACCESS_LEVEL_THREE,
								ACCESS_LEVEL_FOUR,
								ACCESS_LEVEL_FIVE,
							],
							accessStatus: 'Logged-out',

							created_at: currentDate,
							created_by: userid,
							updated_at: currentDate,
							updated_by: userid,
						})

						userObject
							.save()
							.then((result) => {
								res.status(201).json({
									message: `SuperUser created successfully`,
								})
							})
							.catch((err) => {
								console.log(err)
								res.status(500).json({
									message: 'SuperUser Creation Failed. ' + err.message,
								})
							})
						//========================================================
					}
				})
			}
		})
}
