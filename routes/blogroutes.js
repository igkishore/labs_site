const express = require('express');
const blogcontroller = require('../controllers/blogcontroller');
const router = express.Router();

router.get('/', blogcontroller.blogs_get);

module.exports = router;