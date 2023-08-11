const mongoose = require('mongoose')

const accessLogSchema = mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,
		userid: { type: String },
		username: { type: String },
		usersurname: { type: String },
		jobtitle: { type: String },
		speciality: { type: String },
		department: { type: String },
		accessPrivilege: [{ type: String }],
		accessStatus: { type: String },
		activityLog: { type: String },
	},
	{ collection: 'accessLog' }
)
module.exports = mongoose.model('AccessLogModel', accessLogSchema)
/////////////////////////////////////////////////////////////////////////
