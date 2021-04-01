const express = require('express');
const membercontroller = require('../controllers/membercontroller');
const router = express.Router();

router.get('/', membercontroller.members_get);

module.exports = router;