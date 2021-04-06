const express = require('express');
const blogcontroller = require('../controllers/blogcontroller');
const router = express.Router();

router.get('/', blogcontroller.blogs_get);
router.get('/:id', blogcontroller.blogs_get_details);

module.exports = router;