////////////////////// CORE MODULE IMPORTS //////////////////
const mongoose = require('mongoose')
ObjectId = mongoose.Types.ObjectId
const { format } = require('date-fns')
const AccessLogModel = require('../models/accessLogModel')
const UserModel = require('../models/userModel')

//====================== CURRENT USER AND DATE STAMP ==========================
const currentDate = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`

function isValidObjectId(id) {
	if (ObjectId.isValid(id)) {
		if (String(new ObjectId(id)) === id) return true
		return false
	}

	return false
}
////////////////////////////////////////////////////////////////////////////////

//=============================================================================

exports.logout = async (req, res, next) => {
	//const userid = req.params.userid
	const userid = req.query.userid

	if (isValidObjectId(userid)) {
		await UserModel.find({ _id: userid })
			.exec()
			.then((result) => {
				if (!result) {
					// do nothing
				} else {
					////////////////////////////////////////////////////////////
					UserModel.updateOne(
						{ _id: userid },
						{
							$set: {
								accessStatus: 'logged-out',
								lastLogin: currentDate,
							},
						}
					)
						.then((result) => {
							// Do nothing
						})
						.catch((err) => {
							return res.status(500).json({
								myError: 'Logout update failed',
							})
						})
					///////////////////////////////////////////////////////

					///////////////////////////////////////////////////////////////
					for (const key in result) {
						const AccessLogObject = new AccessLogModel({
							_id: new mongoose.Types.ObjectId(),
							userid: result[key].userid,
							username: result[key].username,
							usersurname: result[key].usersurname,
							jobtitle: result[key].jobtitle,
							speciality: result[key].speciality,
							department: result[key].department,
							accessPrivilege: result[key].accessPrivilege,
							accessStatus: 'Logged-out',
							activityLog: currentDate,
						})

						AccessLogObject.save()
							.then((result) => {
								res.status(201).json({
									message: `Logout Successful`,
								})
							})
							.catch((err) => {
								console.log(err)
								res.status(500).json({
									myError: 'Access Log Creation Failed. ' + err.message,
								})
							})
					}
					//////////////////////////////////////////////////////
				}
			})
			.catch((err) => {
				// res.status(200).json({
				// 	message: 'Logged out!',
				// })
			})
	} else {
		return res.status(404).json({ Message: 'No valid response for given ID' })
	}
}
