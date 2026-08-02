module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'CastError') {
    return res.status(404).json({ error: 'Resource not found' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate value' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
};