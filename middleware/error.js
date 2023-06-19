module.exports = (error, req, res, next) => {
    if (
        error.message === "ERROR_CREATING_USER" ||
        "ERROR_HASHING_PASSWORD" ||
        "ERROR_COMPARING_PASSWORD" ||
        "ERROR_SAVING_BOOK" ||
        "ERROR_UPDATE_BOOK" ||
        "ERROR_DELETE_BOOK"
    ) {
        res.status(500).json({ error });
    } else if (error.message === "ERROR_USER_NOT_FOUND" || "ERROR_INVALID_PASSWORD") {
        res.status(401).json({ error });
    } else if (error.message === "ERROR_FINDING_USER" || "ERROR_FINDING_BOOK") {
        res.status(404).json({ error });
    } else if (error.message === "ERROR_UNAUTHORIZED") {
        res.status(403).json({ message: "unauthorized request" });
    } else if (error.message === "ERROR_DUPLICATE_RATE") {
        res.status(400).json({ error });
    } else {
        res.status(500).json({ error });
    }
};
