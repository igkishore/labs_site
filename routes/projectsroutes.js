const express = require('express');
const { ensureAuthenticated } = require('../auth');
const projectController = require('../controllers/projectscontroller.js');

const router = express.Router();

router.get('/', projectController.project_get);
router.get('/:id', projectController.project_details_get);

module.exports = router;

