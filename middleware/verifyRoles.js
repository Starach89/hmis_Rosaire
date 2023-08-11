const jwt = require('jsonwebtoken')
////////////////////  ENVIRONMENT VARIABLES ////////////////////////////////
require('dotenv').config()
const NODE_SERVER_ACCESS_TOKEN_SECRET =
	process.env.NODE_SERVER_ACCESS_TOKEN_SECRET

const verifyPrivilege = (...allowedPrivileges) => {
	return (req, res, next) => {
		const PrivilegeArray = [...allowedPrivileges]

		/////////////////////////////////////////////////////////////////////////////////

		const tokenString = req.headers.authorization || req.headers.Authorization

		if (!tokenString?.startsWith('Bearer ')) {
			return res.status(401).json({
				message: 'Authentication failed!',
			})
		} else {
			const accessToken = tokenString.split(' ')[1]

			jwt.verify(accessToken, NODE_SERVER_ACCESS_TOKEN_SECRET, (err) => {
				if (err) {
					res.status(401).json({
						message: 'Authentication Failed!',
					})
				} else {
					const accessPrivilege = jwt.decode(accessToken).accessPrivilege

					const authorizedPrivilege = PrivilegeArray.some((element) =>
						accessPrivilege.includes(element)
					)

					if (!accessPrivilege) {
						return res.status(401).json({
							message: 'Autorization failed!',
						})
					} else if (!authorizedPrivilege) {
						return res.status(401).json({
							message: 'Autorization failed!',
						})
					} else {
						next()
					}
				}
			})
		}
		//////////////////////////////////////////////////////////////////////////////////
	}
}
module.exports = verifyPrivilege
