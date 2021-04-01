const express = require('express');
const projectcontroller = require('../controllers/projectcontroller');
const router = express.Router();

router.get('/', projectcontroller.project_get);

module.exports = router;