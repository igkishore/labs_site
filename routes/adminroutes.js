const express = require('express');
const { ensureAuthenticated } = require('../auth');
const adminController = require('../controllers/admincontroller.js');

const router = express.Router();

router.get('/', adminController.admin_dashboard_get);
router.get('/reviewproject', adminController.admin_reviewproject_get);
router.get('/reviewblog', adminController.admin_reviewblog_get);
router.get('/reviewmember', adminController.admin_reviewmember_get);
router.get('/addproject', adminController.admin_addproject_get);
router.get('/addblog', adminController.admin_addblog_get);
router.get('/addmember', adminController.admin_addmember_get);
router.get('/editprojects', adminController.admin_editprojects_get);
router.get('/editblogs', adminController.admin_editblogs_get);


module.exports = router;