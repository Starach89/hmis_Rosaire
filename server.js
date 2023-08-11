///////////////////////  ENVIRONMENT VARIABLES ///////////////
const mongoose = require('mongoose')
require('dotenv').config()
const NODE_SERVER_PORT = process.env.NODE_SERVER_PORT

////////////////////// CORE MODULE IMPORTS //////////////////
const http = require('http')
const app = require('./app')
const server = http.createServer(app)

//////////////////// RUNNING SERVER //////////////////////////
mongoose.connection.once(
	'open',
	() => {
		console.log('Connection to MongoDB Established!')
		server.listen(NODE_SERVER_PORT, () =>
			console.log(`Server running on port ${NODE_SERVER_PORT}`)
		)
	},
	{ userNewParser: true, useCreateIndex: true, useUnifiedTopology: true }
)
