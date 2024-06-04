const express = require('express');
const path = require('path');
const session = require("express-session");
const seesveeRoute = require("./backend/src/routes/seesvee.route.js");
const app = express();
const cors = require('cors');
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
app.use(express.static("public"));
app.use("/seesvee", seesveeRoute);

// Serve static files from the React app and more!
app.use(express.static(path.join(__dirname, 'build')));

// API routes
app.get('/api', (req, res) => {
  res.send('API is working');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

