const express = require('express');
const { ensureAuthenticated } = require('../auth');
const memberController = require('../controllers/membercontroller.js');

const router = express.Router();

router.get('/', memberController.member_get);


module.exports = router;