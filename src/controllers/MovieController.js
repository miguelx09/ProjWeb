const Movie = require('../models/Movie');

exports.index = async (req, res) => {
  const movies = await Movie.find().populate('reviews');
  res.json(movies);
};

exports.show = async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'user', select: 'name email' } });
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
};

exports.create = async (req, res) => {
  const { title, description, year } = req.body;
  const movie = await Movie.create({ title, description, year });
  res.status(201).json(movie);
};

exports.update = async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
};

exports.remove = async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
