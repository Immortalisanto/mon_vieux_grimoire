const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/error");
require("dotenv").config({ path: "./.env.local" });

const app = express();

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
    if (error.name === "ValidationError") {
        res.status(400).json({ error });
    } else {
        next(error);
    }
});

app.use(errorHandler);

module.exports = app;
