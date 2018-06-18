var express = require("express");
var exphbs = require("express-handlebars");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
//app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local gossipmongo database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/gossipmongo";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

db.on("error", function (err) {
  console.log("Mongoose Error", err);
})
db.once("open", function () {
  console.log("Mongoose connection successful");
})

// Handlebars config 
var hbs = exphbs.create({ defaultLayout: "main" });

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars");

// Routes

// A GET route for scraping LaineyGossip's website
app.use(require("./routes/html-routes.js"));
app.use(require("./routes/articles-route.js"));
app.use(require("./routes/notes-route.js"));
app.use(require("./routes/scraper-route.js"));

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
