var express = require("express");
var router = express.Router();
var db = require("../models");

// GET route for saving article
router.get("/save/:id", function (req, res) {

    db.Article.update(
        { _id: req.params.id },
        { saved: true }).then(function (result) {
            res.redirect("/")
            console.log(result);
        }).catch(function (err) {
            res.json(err);
            console.log(err);
        });
});

router.get("/saved", function (req, res) {
    db.Article.find({ saved: true }).populate("notes").exec(function (err, article) {
        var hbsObject = {
            articles: article
        };
        res.render("saved", hbsObject);
    });
});

// Remove article from saved list
router.delete("/delete/:id", function (req, res) {
    db.Article.remove({ _id: req.params.id }).then(function (result) {
        res.json(result);
    }).catch(function (err) {
        res.json(err);
    });
});

module.exports = router;