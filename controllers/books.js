const Book = require("../models/Book");
const { deleteImage } = require("../functions/deleteImage");

exports.getAllBooks = (req, res, next) => {
    console.log("Début getAllBooks");

    Book.find()
        .then((books) => {
            res.status(200).json(books);

            console.log("getAllBooks OK");
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    console.log("Début getOneBook");

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            res.status(200).json(book);

            console.log("getOneBook OK");
        })
        .catch((error) => res.status(404).json({ error }));
};

exports.getThreeBestRating = async (req, res, next) => {
    console.log("Début getThreeBestRating");

    try {
        const books = await Book.find().sort({ averageRating: -1 }).limit(3);

        const formattedBooks = books.map((book) => {
            const { _id, title, author, year, genre, imageUrl, averageRating } = book;
            return { _id, title, author, year, genre, imageUrl, averageRating };
        });

        res.json(formattedBooks);

        console.log("getThreeBestRating OK");
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.createBook = (req, res, next) => {
    console.log("Début createBook");

    console.log("createBook avant le JSON.parse et les delete :", req.body.book);

    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    console.log("Tentative de création :", bookObject);

    const imageName = res.locals.imageName;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${imageName}`,
    });

    console.log("Schéma prêt");

    book.save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });

            console.log("createBook OK");
        })
        .catch((error) => {
            res.status(400).json({ error });
            deleteImage(`backend/images/${imageName}`);
        });
};

exports.putOneBook = (req, res, next) => {
    console.log("Début putOneBook");

    const imageName = res.locals.imageName;

    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${imageName}`,
          }
        : { ...req.body };

    console.log("bookObject :", bookObject);

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
                deleteImage(`backend/images/${imageName}`);
            } else {
                const oldImage = book.imageUrl.replace(`${req.protocol}://${req.get("host")}/`, "backend/");

                console.log("oldImage :", oldImage);

                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => {
                        console.log("début update");

                        if (req.file) {
                            console.log("condition oldImage OK");

                            deleteImage(oldImage);
                        }
                        res.status(200).json({ message: "Objet modifié " });

                        console.log("putOneBook OK");
                    })
                    .catch((error) => {
                        res.status(401).json({ error });
                        deleteImage(`backend/images/${imageName}`);
                    });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
            console.log("tentative suppression imageName :", imageName);
            deleteImage(`backend/images/${imageName}`);
        });
};

exports.deleteOneBook = (req, res, next) => {
    console.log("Début deleteOneBook");

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                const oldImage = book.imageUrl.replace(`${req.protocol}://${req.get("host")}/`, "backend/");
                deleteImage(oldImage);
                Book.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: "Livre supprimé" });

                        console.log("deleteOneBook OK");
                    })
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.addRating = (req, res, next) => {
    console.log("Début addRating");

    const { userId, rating } = req.body;

    console.log("Tentative de création d'une nouvelle note :", userId, rating);

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            const userHasRated = book.ratings.some((rating) => rating.userId === userId);

            if (userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else if (userHasRated) {
                res.status(401).json({ message: "Une note a déjà été donnée par cet utilisateur" });
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
                        res.status(200).json(book);
                        console.log("addRating OK");
                    })
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
