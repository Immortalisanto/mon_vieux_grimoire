const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookControllers = require("../controllers/books");

router.get("/", bookControllers.getAllBooks);
router.post("/", auth, multer, bookControllers.createBook);

module.exports = router;
