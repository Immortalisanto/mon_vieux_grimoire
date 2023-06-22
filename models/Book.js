const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    year: { type: Number, required: true, match: [/^[0-9]{1,4}$/, "Le format de l'année n'est pas valide"] },
    genre: {
        type: String,
        required: true,
    },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true, match: [/^[1-5]$/, "Le format de la note n'est pas valide"] },
        },
    ],
    averageRating: { type: Number },
});

module.exports = mongoose.model("Book", bookSchema);
