const express = require('express');
const { ensureAuthenticated } = require('../auth');
const membersController = require('../controllers/memberscontroller.js');

const router = express.Router();

router.get('/', membersController.member_dashboard_get);
router.get('/addproject', membersController.admin_addproject_get);
router.get('/addblog', membersController.member_addblog_get);


module.exports = router;