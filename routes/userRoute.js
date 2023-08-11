const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

const verifyRoles = require('../middleware/verifyRoles')

const routePrivilegeController = require('../controllers/routePrivilegeController')
let routePrivilege = routePrivilegeController.routePrivileges()

router.post(
	'/',
	verifyRoles(routePrivilege.USER_CREATE),
	userController.user_post
)

router.get(
	'/',
	verifyRoles(routePrivilege.USER_VIEW_ALL),
	userController.user_get_all
)

router.get(
	'/:id',
	verifyRoles(routePrivilege.USER_VIEW_DETAILS),
	userController.user_get_one
)

router.patch(
	'/:id',
	verifyRoles(routePrivilege.USER_UPDATE),
	userController.user_patch
)

router.delete(
	'/:id',
	verifyRoles(routePrivilege.USER_DELETE),
	userController.user_delete
)
module.exports = router
