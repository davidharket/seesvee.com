const express = require("express");
const session = require("express-session");
const seesveeRoute = require("./routes/seesvee.route.js");
const cors = require('cors');
const app = express();
app.use(cors("*"));
const PORT = process.env.PORT || 8000;
const dotenv = require("dotenv");
dotenv.config();
require("./config/db.connection.js");
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
app.use(express.static("public"));

app.use("/seesvee", seesveeRoute);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
