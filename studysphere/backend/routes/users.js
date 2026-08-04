const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMyActivity } = require('../controllers/userController');

router.get('/me', auth, getMyActivity);

module.exports = router;
