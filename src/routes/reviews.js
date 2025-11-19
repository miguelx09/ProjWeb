const router = require("express").Router();
const ReviewController = require("../controllers/ReviewController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, ReviewController.add);
router.post("/:id/vote", auth, ReviewController.vote);

module.exports = router;
