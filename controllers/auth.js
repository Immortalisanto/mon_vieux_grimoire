const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env.local" });

exports.signup = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() => {
                    res.status(201).json({ message: "Utilisateur créé" });
                })
                .catch((error) => next(error));
        })
        .catch((error) => next(error));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(401).json({
                    message: "Paire identifiant/mot de passe incorrecte",
                });
            } else {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(401).json({
                                message: "Paire identifiant/mot de passe incorrecte",
                            });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "24h" }),
                            });
                        }
                    })
                    .catch((error) => next(error));
            }
        })
        .catch((error) => next(error));
};
