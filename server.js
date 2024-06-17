const express = require("express");
const path = require("path");
const session = require("express-session");
const seesveeRoute = require("./backend/src/routes/seesvee.route.js");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
require("./backend/src/config/db.connection.js");

app.use(cors("*"));

app.use(
  session({
    secret: process.env.STRIPE_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "build")));

app.use("/seesvee", seesveeRoute);

app.get("/api", (req, res) => {
  res.send("API is working");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running`);
});