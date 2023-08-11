const express = require('express')
const router = express.Router()

const defaultAdminController = require('../controllers/defaultAdminController')

const checkAuth = require('../middleware/checkAuth')
const verifyRoles = require('../middleware/verifyRoles')

const routePrivilegeController = require('../controllers/routePrivilegeController')
let routePrivileges = routePrivilegeController.routePrivileges()

router.post(
	'/',
	// verifyRoles(
	// 	routePrivileges.ACCESS_LEVEL_ONE,
	// 	routePrivileges.ACCESS_LEVEL_TWO,
	// 	routePrivileges.ACCESS_LEVEL_THREE,
	// 	routePrivileges.ACCESS_LEVEL_FOUR,
	// 	routePrivileges.ACCESS_LEVEL_FIVE
	// ),
	defaultAdminController.user_post
)

// router.delete(
// 	'/:id',
// 	// verifyRoles(
// 	// 	routePrivileges.ACCESS_LEVEL_ONE,
// 	// 	routePrivileges.ACCESS_LEVEL_TWO,
// 	// 	routePrivileges.ACCESS_LEVEL_THREE,
// 	// 	routePrivileges.ACCESS_LEVEL_FOUR,
// 	// 	routePrivileges.ACCESS_LEVEL_FIVE
// 	// ),
// 	defaultAdminController.user_delete
// )

module.exports = router
