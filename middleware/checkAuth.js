////////////////////// CORE MODULE IMPORTS //////////////////
const jwt = require('jsonwebtoken')
require('dotenv').config()
////////////////////  ENVIRONMENT VARIABLES ////////////////////////////////

const NODE_SERVER_ACCESS_TOKEN_SECRET =
	process.env.NODE_SERVER_ACCESS_TOKEN_SECRET

module.exports = async (req, res, next) => {
	const tokenString = req.headers.authorization || req.headers.Authorization
	//console.log('CheckAuth.js: ', req.headers)
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
				next()
			}
		})
	}
}
