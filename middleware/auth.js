const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        console.log("Début de l'auth");

        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };

        console.log("auth OK");

        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
