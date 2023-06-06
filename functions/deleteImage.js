const fs = require("fs");

exports.deleteImage = (imageUrl) => {
    fs.unlink(`../${imageUrl}`, (error) => {
        if (error) {
            console.error("Erreur deleteImage :", error);
        }
    });
};
