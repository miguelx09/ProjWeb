const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const auth = require('../middlewares/authMiddleware');

router.get('/', MovieController.index);
router.post('/', auth, MovieController.create);
router.get('/:id', MovieController.show);
router.put('/:id', auth, MovieController.update);
router.delete('/:id', auth, MovieController.remove);

module.exports = router;
