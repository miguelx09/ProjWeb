const router = require("express").Router();
const MovieController = require("../controllers/MovieController");
const auth = require("../middlewares/authMiddleware");

router.get("/", MovieController.getAll);
router.get("/:id", MovieController.getById);
router.post("/", auth, MovieController.create);

module.exports = router;
