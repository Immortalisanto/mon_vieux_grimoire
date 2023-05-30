const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env.local" });

exports.signup = (req, res, next) => {
    console.log("Début signup");

    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            console.log("hashage du password");

            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() => {
                    res.status(201).json({ message: "Utilisateur créé" });

                    console.log("signup OK");
                })
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    console.log("Début login");

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(401).json({
                    message: "Paire identifiant/mot de passe incorrecte",
                });

                console.log("email non trouvé");
            } else {
                console.log("email trouvé, début comparaison password");

                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(401).json({
                                message:
                                    "Paire identifiant/mot de passe incorrecte",
                            });

                            console.log("password invalide");
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.TOKEN_SECRET,
                                    { expiresIn: "24h" }
                                ),
                            });

                            console.log("login OK");
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
