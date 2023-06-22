const Book = require("../models/Book");
const { deleteImage } = require("../functions/deleteImage");

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => {
            res.status(200).json(books);
        })
        .catch(() => {
            res.status(404).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            res.status(200).json(book);
        })
        .catch(() => {
            res.status(404).json({ error });
        });
};

exports.getThreeBestRating = async (req, res, next) => {
    try {
        const books = await Book.find().sort({ averageRating: -1 }).limit(3);

        const formattedBooks = books.map((book) => {
            const { _id, title, author, year, genre, imageUrl, averageRating } = book;
            return { _id, title, author, year, genre, imageUrl, averageRating };
        });

        res.json(formattedBooks);
    } catch (error) {
        return res.status(404).json({ error });
    }
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const imageName = res.locals.imageName;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${imageName}`,
    });
    book.save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });
        })
        .catch((error) => {
            deleteImage(`backend/images/${imageName}`);
            if (error.name === "ValidationError") {
                res.status(400).json({ error });
            } else {
                res.status(500).json({ error });
            }
        });
};

exports.putOneBook = (req, res, next) => {
    const imageName = res.locals.imageName;

    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${imageName}`,
          }
        : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                deleteImage(`backend/images/${imageName}`);
                return res.status(403).json({ message: "unauthorized request" });
            } else {
                const oldImage = book.imageUrl.replace(`${req.protocol}://${req.get("host")}/`, "backend/");

                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => {
                        if (req.file) {
                            deleteImage(oldImage);
                        }
                        res.status(200).json({ message: "Objet modifié " });
                    })
                    .catch((error) => {
                        deleteImage(`backend/images/${imageName}`);
                        if (error.name === "ValidationError") {
                            res.status(400).json({ error });
                        } else {
                            res.status(500).json({ error });
                        }
                    });
            }
        })
        .catch(() => {
            deleteImage(`backend/images/${imageName}`);
            res.status(404).json({ error });
        });
};

exports.deleteOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                return res.status(403).json({ message: "unauthorized request" });
            } else {
                const oldImage = book.imageUrl.replace(`${req.protocol}://${req.get("host")}/`, "backend/");
                deleteImage(oldImage);
                Book.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: "Livre supprimé" });
                    })
                    .catch(() => {
                        res.status(500).json({ error });
                    });
            }
        })
        .catch(() => {
            res.status(404).json({ error });
        });
};

exports.addRating = (req, res, next) => {
    const { userId, rating } = req.body;

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            const userHasRated = book.ratings.some((rating) => rating.userId === userId);

            if (userId != req.auth.userId) {
                return res.status(403).json({ message: "unauthorized request" });
            } else if (userHasRated) {
                return res.status(400).json({ error });
            } else {
                book.ratings.push({ userId, grade: rating });

                let totalRating = 0;
                book.ratings.forEach((rating) => {
                    totalRating += rating.grade;
                });
                const averageRatingBeforeRounded = totalRating / book.ratings.length;

                book.averageRating = averageRatingBeforeRounded.toFixed(2);

                book.save()
                    .then(() => {
                        res.status(201).json(book);
                    })
                    .catch((error) => {
                        if (error.name === "ValidationError") {
                            res.status(400).json({ error });
                        } else {
                            res.status(500).json({ error });
                        }
                    });
            }
        })
        .catch(() => {
            res.status(404).json({ error });
        });
};
