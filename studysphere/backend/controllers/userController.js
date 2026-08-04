const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.getMyActivity = async (req, res, next) => {
  try {
    const [questions, answers] = await Promise.all([
      Question.find({ author: req.user.id }).sort({ createdAt: -1 }).lean(),
      Answer.find({ author: req.user.id })
        .populate('question', 'title')
        .sort({ createdAt: -1 })
        .lean()
    ]);

    const upvotesReceived = answers.reduce((sum, a) => sum + a.upvotes.length, 0);

    res.json({
      questionsCount: questions.length,
      answersCount: answers.length,
      upvotesReceived,
      questions,
      answers
    });
  } catch (err) {
    next(err);
  }
};
