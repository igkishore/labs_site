const express = require('express');
const projectcontroller = require('../controllers/projectcontroller');
const router = express.Router();

router.get('/', projectcontroller.project_get);
router.get('/:id', projectcontroller.project_get_details);

module.exports = router;