const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { authRequired, checkUser } = require("./middleware/auth");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/quizzes", authRequired, (req, res) => res.render("quizzes"));
app.use(authRoutes);
