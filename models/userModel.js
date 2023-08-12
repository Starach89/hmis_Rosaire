const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,
		username: { type: String },
		usersurname: { type: String },
		gender: { type: String },
		jobtitle: { type: String },
		speciality: { type: String },
		role: [{ type: String }],
		department: { type: String },
		login: { type: String },
		password: { type: String },
		accessPrivilege: [{ type: String }],
		isActive: { type: Boolean },
		isDeleted: { type: Boolean },
		created_at: { type: String },
		created_by: { type: String },
		updated_at: { type: String },
		updated_by: { type: String },
		lastLogin: { type: String },
	},
	{ collection: 'users' }
)
module.exports = mongoose.model('UserModel', userSchema)
/////////////////////////////////////////////////////////////////////////
