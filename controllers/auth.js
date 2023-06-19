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
                .catch(() => next(new Error("ERROR_CREATING_USER")));
        })
        .catch(() => next(new Error("ERROR_HASHING_PASSWORD")));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                next(new Error("ERROR_USER_NOT_FOUND"));
            } else {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            next(new Error("ERROR_INVALID_PASSWORD"));
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "4h" }),
                            });
                        }
                    })
                    .catch(() => next(new Error("ERROR_COMPARING_PASSWORD")));
            }
        })
        .catch(() => next(new Error("ERROR_FINDING_USER")));
};
