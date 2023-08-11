////////////////////  ENVIRONMENT VARIABLES /////////////////
require('dotenv').config()
const MONGO_DB_CONNECTION_STRING =
	process.env.MONGO_DB_SERVER_PROTOCOL +
	'://' +
	process.env.MONGO_DB_SERVER_IP +
	':' +
	process.env.MONGO_DB_SERVER_PORT +
	'/' +
	process.env.MONGO_DB_APP_DATABASE_NAME

////////////////////// CORE MODULE IMPORTS //////////////////
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')

///////////////////// CUSTOM IMPORTS ////////////////////////
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const checkAuth = require('./middleware/checkAuth')
const credentials = require('./middleware/credentials')

////////////////// EVENT LOGGING MIDDLEWARE //////////////////
app.use(logger)

////////////// CROSS ORIGIN RESOURCE SHARING /////////////////
app.use(credentials) // MUST COME BEFORE CORES
app.use(cors(corsOptions))

//////////////// DATABASE CONNECTION /////////////////////////
mongoose.set('strictQuery', false)
mongoose.connect(MONGO_DB_CONNECTION_STRING)

///////////////////// OTHER MIDDLEWARE ///////////////////////
app.use(express.urlencoded({ extended: false })) //Parse URL-encoded bodies
app.use(express.json()) //Parse JSON bodies
app.use(cookieParser()) // Parse cookies
app.use('/', express.static(path.join(__dirname, '/public')))

//////////////////////// LOCAL IMPORTS ////////////////////////
const rootRoute = require('./routes/root')
const userRoute = require('./routes/userRoute')
const loginRoute = require('./routes/loginRoute')
const logoutRoute = require('./routes/logoutRoute')
const defaultAdminRoute = require('./routes/defaultAdminRoute')
const errorRoutes = require('./routes/error')

//const userReg2Route = require('./routes/userReg2Route')

////////////////// ROOT-ROUTE FOR API DOCUMENTATION /////////////

///////////////// AUTHENTICATED API-ROUTES //////////////////////
app.use('/', rootRoute)
app.use('/login', loginRoute)
app.use('/logout', logoutRoute)
app.use('/defaultadmin', defaultAdminRoute)
app.use(checkAuth)
//////////////////// PUBLIC API-ROUTES //////////////////////////

app.use('/user', userRoute)

////////////////////////// ERROR ROUTES /////////////////////////
app.use((req, res, next) => {
	const myError = new Error('404 Not Found')
	myError.status = 404
	next(myError)
})

app.use((myError, req, res, next) => {
	res.status(myError.status || 500)
	res.json({
		myError: {
			message: myError.message,
		},
	})
})

app.use('*', errorRoutes)

///////////////////// ERROR HANDLING MIDDLEWARE /////////////////
app.use(errorHandler)

module.exports = app
