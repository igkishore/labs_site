const express = require('express');
const { ensureAuthenticated } = require('../auth');
const blogController = require('../controllers/blogscontroller.js');

const router = express.Router();

router.get('/', blogController.blog_get);
router.get('/:id', blogController.blog_details_get);


module.exports = router;