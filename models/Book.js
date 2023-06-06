const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    title: {
        type: String,
        required: true,
        match: [
            /^[A-Za-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s']{,50}$/,
            "Le format du titre n'est pas valide",
        ],
    },
    author: {
        type: String,
        required: true,
        match: [
            /^[A-Za-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s.-]{,40}$/,
            "Le format de l'auteur n'est pas valide",
        ],
    },
    year: { type: Number, required: true, match: [/^[0-9]{1,4}$/, "Le format de l'année n'est pas valide"] },
    genre: {
        type: String,
        required: true,
        match: [
            /^[A-Za-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s-]{,30}$/,
            "Le format du genre n'est pas valide",
        ],
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
