// Global variables
var reactions = ["excited", "facepalm", "omg", "confused", "amazing"];
var favorites = [];
var ifAddMore = "", addPresent = false;
var offset = 0, max = 0;

// Create Buttons
function createButtons() {

    for (let i = 0; i < reactions.length; i++) {
        var newBtn = $("<button>");
        $(newBtn).text(reactions[i]);
        newBtn.attr("data-name", reactions[i]);
        newBtn.addClass("reaction btn btn-info m-1");
        $("#buttons").append(newBtn);
    }

}

// Get gifs from giphy, Make blocks with related info for every gif, Display elements in UI
function displayGifs(arg) {

    if (arg == "add") {
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + ifAddMore + "&api_key=2GuZlr3V4NmdWt8DPnAjUoO38tsH5BPs";
        if (offset == 0) {
            offset += 10;
        } else {
            offset += 5;
        }
        max = offset + 5;
    } else {
        $("#gifs-appear-here").empty();

        var reaction = $(this).attr("data-name");
        ifAddMore = reaction;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + reaction + "&api_key=2GuZlr3V4NmdWt8DPnAjUoO38tsH5BPs&limit=10";
        offset = 0;
        max = 10;
    }
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        for (let i = offset; i < max; i++) {
            let newGifDiv = $("<div>");
            newGifDiv.addClass("float-left m-2 border rounded p-2");

            let gif = $("<img>");
            gif.addClass("gif");
            gif.attr("width", "150");
            gif.attr("height", "150");
            gif.attr("id", response.data[i].id);
            gif.attr("data-still", response.data[i].images.original_still.url);
            gif.attr("data-animate", response.data[i].images.original.url);
            gif.attr("src", response.data[i].images.fixed_height_still.url);
            gif.attr("data-state", "still");
            newGifDiv.append(gif);

            let rating = $("<p>");
            rating.text("Rating: " + response.data[i].rating);
            newGifDiv.append(rating);

            // One-Click Download
            // works fine in Internet Explorer
            // But not in Chrome or Firefox (Opens url instead).

            var aTag = $("<a>");
            aTag.attr("href", response.data[i].images.original.url);
            aTag.attr("download", "gif");
            aTag.attr("data-toggle", "tooltip");
            aTag.attr("data-placement", "top");
            aTag.attr("title", "Use Internet Explorer for download to work appropriately!!");
            var downloadBtn = $("<button>");
            downloadBtn.attr("data-url", response.data[i].images.original.url)
            downloadBtn.addClass("download btn btn-lg glyphicon glyphicon-download");
            aTag.append(downloadBtn);
            newGifDiv.append(aTag);

            // Add to Favorites space

            var fav = $("<button>");
            fav.addClass("fav glyphicon glyphicon-star btn btn-lg");
            fav.attr("data-still", response.data[i].images.original_still.url);
            fav.attr("data-animate", response.data[i].images.original.url);
            fav.attr("data-toggle", "tooltip");
            fav.attr("data-placement", "top");
            fav.attr("title", "Add to favorites!");
            newGifDiv.append(fav);

            $("#gifs-appear-here").append(newGifDiv);
        }

    });

    if (addPresent) {
        $("#add").remove();
        addPresent = false;
    }

    // Add more Button to add more gifs of same kind
    if (max != 25) {
        var addMore = $("<button>");
        addMore.addClass("add-more my-5 btn btn-danger btn-lg");
        addMore.attr("id", "add");
        addMore.text("5 more from " + ifAddMore);
        $("#form").append(addMore);
        addPresent = true;
    }

}

// Update Favorites div
function updateFavorites() {
    $(".favorites").empty();
    for (let i = 0; i < favorites.length; i++) {
        var newFav = $("<img>");
        newFav.attr("src", favorites[i]);
        newFav.attr("width", "100");
        newFav.attr("height", "100");
        newFav.addClass("m-1")
        $(".favorites").append(newFav);
    }
}

// To make element to blink
setInterval(function () {
    $('blink').each(function () {
        $(this).toggle();
    });
}, 500);

// Main Routine
$(document).ready(function () {
    createButtons();

    // Add more buttons 
    $("#add-reaction").on("click", function () {

        event.preventDefault();
        let newReaction = $("#new-reaction").val().trim().toLowerCase();
        if (newReaction != "") {
            if ((reactions.indexOf(newReaction)) < 0) {
                reactions.push(newReaction);
            } else {
                alert("It's up there already!!");
            }
        }
        $("#buttons").empty();
        createButtons();
        $("#new-reaction").val("");

    });

    $(document).on("click", ".reaction", displayGifs);

    // Toggle animate and still
    $(document).on('click', '.gif', function () {
        let state = $(this).attr("data-state");
        if (state == "still") {
            let newSrc = $(this).attr("data-animate");
            $(this).attr("src", newSrc);
            $(this).attr("data-state", "animate");
        } else {
            let newSrc = $(this).attr("data-still");
            $(this).attr("src", newSrc);
            $(this).attr("data-state", "still");
        }
    });

    // Action listener for Add-To-Fav
    $(document).on('click', '.fav', function () {
        if ((favorites.indexOf($(this).attr("data-animate"))) < 0) {
            favorites.push($(this).attr("data-animate"));
            localStorage.clear();
            localStorage.setItem("favArray", favorites);
        }
        updateFavorites();
    });

    // Action Listener for Add-More button
    $(document).on('click', '.add-more', function (event) {
        event.preventDefault();
        displayGifs("add");
    });
});

// Initialize page with contents from local storage
if (localStorage.getItem("favArray").length > 0) {
    var temp = localStorage.getItem("favArray");
    var favorites = temp.split(",");
    updateFavorites();
}