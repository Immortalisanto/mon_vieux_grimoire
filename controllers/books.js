const Book = require("../models/Book");

exports.getAllBooks = (req, res, next) => {
    console.log("Début getAllBooks");

    Book.find()
        .then((books) => {
            res.status(200).json(books);

            console.log("getAllBooks OK");
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
    console.log("Début createBook");

    console.log(
        "createBook avant le JSON.parse et les delete :",
        req.body.book
    );

    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    console.log("Tentative de création :", bookObject);

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });

    console.log("Schéma prêt");

    book.save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });

            console.log("createBook OK");
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};
