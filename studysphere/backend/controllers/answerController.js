const Answer = require('../models/Answer');
const Question = require('../models/Question');

exports.createAnswer = async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body || !body.trim()) return res.status(400).json({ error: 'Answer body is required' });

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const answer = await Answer.create({ body, question: question._id, author: req.user.id });
    const populated = await answer.populate('author', 'name');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.toggleUpvote = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    if (String(answer.author) === req.user.id) {
      return res.status(403).json({ error: "You can't upvote your own answer" });
    }

    const idx = answer.upvotes.findIndex((u) => String(u) === req.user.id);
    if (idx > -1) {
      answer.upvotes.splice(idx, 1);
    } else {
      answer.upvotes.push(req.user.id);
    }
    await answer.save();
    res.json({ _id: answer._id, upvotes: answer.upvotes });
  } catch (err) {
    next(err);
  }
};