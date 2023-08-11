const { logEvents } = require('./logEvents')

const errorHandler = function (err, req, res, next) {
	logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
	res.status(500).send(err.message)
}

module.exports = errorHandler
