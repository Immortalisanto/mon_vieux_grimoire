const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { timeStamp } = require("console");

module.exports = async (req, res, next) => {
    console.log("Début imageSize, l'image :", req.file);

    fs.access("./images", (error) => {
        if (error) {
            fs.mkdirSync("./images");
        }
    });

    const MIME_TYPES = {
        "image/jpg": "jpg",
        "image/jpeg": "jpg",
        "image/png": "png",
    };

    const name = req.file.originalname.split(" ").join("_");
    const timestamp = Date.now();
    const extension = MIME_TYPES[req.file.mimetype];

    console.log(name, timestamp, extension);

    const imageName = `${name}-${timestamp}.${extension}`;

    console.log(imageName);

    const ref = path.join(__dirname, "..", "images", imageName);
    const buffer = req.file.buffer;

    console.log("buffer :", buffer);

    try {
        await sharp(buffer).resize(210).toFile(ref);

        console.log("buffer after sharp :", buffer);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Une erreur s'est produite lors du redimensionnement de l'image.",
        });
    }

    res.locals.imageName = imageName;
    next();
};
