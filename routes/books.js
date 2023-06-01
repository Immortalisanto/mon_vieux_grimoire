const express = require("express");
const multer = require("multer");
const router = express.Router();
const auth = require("../middleware/auth");
const imageSize = require("../middleware/imageSize");
const bookControllers = require("../controllers/books");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/bestrating", bookControllers.getThreeBestRating);
router.get("/:id", bookControllers.getOneBook);
router.get("/", bookControllers.getAllBooks);
router.post(
    "/",
    auth,
    upload.single("image"),
    imageSize,
    bookControllers.createBook
);

module.exports = router;
