const Review = require('../models/Review');
const Movie = require('../models/Movie');

exports.create = async (req, res) => {
  try {
    const { movie: movieId, rating, comment } = req.body;
    const review = await Review.create({ user: req.userId, movie: movieId, rating, comment });
    await Movie.findByIdAndUpdate(movieId, { $push: { reviews: review._id } });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
