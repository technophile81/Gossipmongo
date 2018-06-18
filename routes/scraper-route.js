var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();
var db = require("../models");

// GET to scrape LaineyGossip
router.get("/scrape", function (req, res) {
    axios.get("http://www.laineygossip.com").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article.article-type-standard").each(function (i, element) {

            var result = {};

            result.title = $(this)
                .children("h2")
                .children("a")
                .text();
            result.link = $(this)
                .children("h2")
                .children("a")
                .attr("href");
            result.summary = $(this)
                .find(".txt-box")
                .children("p")
                .text();
            
            db.Article.findOneAndUpdate(
                {link: result.link}, 
                result, 
                {upsert: true}).then(function (dbArticle) {
                console.log(dbArticle);
            }).catch(function (err) {
                console.log(err);
            });
        });
        res.send("Scraped!");
    });
});

// GET all articles
router.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// Grab specific article with its note
router.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("note").then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// Save/update an article's note
router.post("/articles/:id", function(req,res){
    db.Note.create(req.body).then(function(dbNote){
        return db.Article.findOneAndUpdate(
            { _id: req.params.id }, 
            { note:dbNote._id },
            { new: true })
    }).then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

module.exports = router;