const fs = require("fs");

exports.deleteImage = (imageUrl) => {
    console.log("Début deleteImage");

    fs.unlink(`../${imageUrl}`, (error) => {
        console.log("imageUrl :", imageUrl);

        if (error) {
            console.error("Erreur deleteImage :", error);
        } else {
            console.log("deleteImage OK");
        }
    });
};
