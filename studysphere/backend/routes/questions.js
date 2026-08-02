const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  listQuestions,
  getQuestion,
  createQuestion,
  markBestAnswer
} = require('../controllers/questionController');
const { createAnswer } = require('../controllers/answerController');

router.get('/', listQuestions);
router.get('/:id', getQuestion);
router.post('/', auth, createQuestion);
router.post('/:id/answers', auth, createAnswer);
router.patch('/:id/best-answer', auth, markBestAnswer);

module.exports = router;