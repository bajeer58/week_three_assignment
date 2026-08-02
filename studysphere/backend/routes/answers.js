const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { toggleUpvote } = require('../controllers/answerController');

router.patch('/:id/upvote', auth, toggleUpvote);

module.exports = router;