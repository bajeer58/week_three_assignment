const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.listQuestions = async (req, res, next) => {
  try {
    const { tag, sort, search } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const filter = {};
    if (tag && Question.TAGS.includes(tag)) filter.tag = tag;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: regex }, { body: regex }];
    }

    const questions = await Question.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const withCounts = await Promise.all(
      questions.map(async (q) => {
        const answerCount = await Answer.countDocuments({ question: q._id });
        return { ...q, answerCount };
      })
    );

    if (sort === 'popular') {
      withCounts.sort((a, b) => b.answerCount - a.answerCount);
    }

    const total = withCounts.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paged = withCounts.slice(start, start + limit);

    res.json({ questions: paged, total, page, pages });
  } catch (err) {
    next(err);
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name');
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const answers = await Answer.find({ question: question._id })
      .populate('author', 'name')
      .lean();

    answers.sort((a, b) => {
      const aBest = String(a._id) === String(question.bestAnswer);
      const bBest = String(b._id) === String(question.bestAnswer);
      if (aBest && !bBest) return -1;
      if (bBest && !aBest) return 1;
      return b.upvotes.length - a.upvotes.length;
    });

    res.json({ question, answers });
  } catch (err) {
    next(err);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const { title, body, tag } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    if (!body || !body.trim()) return res.status(400).json({ error: 'Body is required' });
    if (!Question.TAGS.includes(tag)) return res.status(400).json({ error: 'Invalid tag' });

    const question = await Question.create({ title, body, tag, author: req.user.id });
    const populated = await question.populate('author', 'name');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.markBestAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    if (String(question.author) !== req.user.id) {
      return res.status(403).json({ error: 'Only the question author can mark a best answer' });
    }
    const answer = await Answer.findById(answerId);
    if (!answer || String(answer.question) !== String(question._id)) {
      return res.status(400).json({ error: 'Invalid answer for this question' });
    }
    question.bestAnswer = answer._id;
    await question.save();
    res.json(question);
  } catch (err) {
    next(err);
  }
};