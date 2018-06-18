$(document).ready(function () {

    $.getJSON("/articles", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        }
    });

    $("#scrapeModal").on("hide.bs.modal", function (event) {
        window.location.href = "/";
    });

    //Scrape articles
    $("#scrape").on('click', function (event) {
        event.preventDefault();
        $.ajax({
            url: "/scrape",
            type: "GET",
            success: function (response) {
            },
            error: function (err) {
                showErrorModal(err);
            },
            complete: function (result) {
                $("#scrapeModal").modal("show");
            }
        });
    });

    // Save an article to the saved page
    $(document).on("click", ".save-article", function (event) {
        let articleId = $(this).data("id");
        $.ajax({
            url: "/save/" + articleId,
            type: "GET",
            success: function (response) {
                window.location.href = "/";
            },
            error: function (err) {
                errorWindow(err);
            }
        });
    });

    $(".delete-article").on("click", function (event) {
        event.preventDefault();
        var id = $(this).data("id");
        $.ajax({
            url: "/delete/" + id,
            type: "DELETE",
            success: function (response) {
                window.location.href = "/saved";
            },
            error: function (err) {
                errorWindow(err)
            }
        });
    });

    $(".save-note").on("click", function (event) {
        event.preventDefault();
        var note = {};
        note.articleId = $(this).attr("data-id");
        note.body = $("#note-text" + note.articleId).val().trim();

        // Run a POST request to save note
        $.ajax({
            method: "POST",
            url: "/addnote/" + note.articleId,
            data: { body: $("#note-text" + note.articleId).val() },
            success: function (response) {
                viewNote(response, note.articleId);
            }
        })
            .then(function (data) {
                console.log(data);
                $("#notes").empty();
            });
        $("#note-text").val("");
    });

    function viewNote(element, articleId) {

        var $deleteButton = $("<button>")
            .text("X")
            .addClass("delete-note")
            .data("note-id", element._id)
            .data("article-id", articleId);
        var $note = $("<div>")
            .text(element.body)
            .addClass("note");

        $note.append($deleteButton);

        var view = $("#note-view" + articleId);
        view.append($note);
        $deleteButton.on("click", deleteNote);
    };

    function deleteNote(event) {
        event.stopPropagation();
        var item = $(this);
        var ids = {
            noteId: $(this).data("note-id"),
            articleId: $(this).data("article-id")
        };
        $.ajax({
            url: "/deletenote",
            type: "POST",
            data: ids,
            success: function (response) {
                item.parent().remove();
            },
            error: function (err) {
                errorWindow(err);
            }
        });
    };

    $(".delete-note").on("click", deleteNote);

    //function to display error modal on ajax error
    function errorWindow(err) {
        $("#error").modal("show");
    };



});