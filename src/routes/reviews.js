const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, ReviewController.create);

module.exports = router;
