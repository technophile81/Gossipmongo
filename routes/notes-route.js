var express = require("express");
var router = express.Router();
var db = require("../models");

// GET route for getting notes
router.get("/notes/:id", function(req,res) {
    db.Article.findOne({ _id: req.params.id }).populate("notes").then(function(results) {
        res.json(results);
    }).catch(function(err) {
        res.json(err);
    });
});

// GET route for single note
router.get("/onenote/:id", function(req, res){ 
    db.Note.findOne({ _id: req.params.id} ).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});

// POST route to create new note
router.post("/addnote/:id", function(req, res) {
    var note = { 
       // title: req.body.title, 
        body: req.body.body, 
        articleId: req.params.id
    };
    db.Note.create(note).then(function(result) {
        db.Article.findOneAndUpdate(
            { _id: req.params.id }, 
            { $push: {notes: result._id }}, 
            { new: true }).then( function (data) {
                res.json(result);
            }).catch( function (err) {
                res.json(err);
            });
    }).catch(function(err){
        res.json(err);
    });
});

// POST route to delete note
router.post("/deletenote", function(req, res) {
    db.Note.remove({ _id: req.body.noteId }).then(function(result){
        res.json(result)
    }).catch(function(err) {
        res.json(err);
    });
});

module.exports = router;