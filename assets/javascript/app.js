var reactions = ["Excited", "Facepalm", "OMG", "Confused", "amazing"];

function createButtons() {

    for (let i = 0; i < reactions.length; i++) {
        var newBtn = $("<button>");
        $(newBtn).text(reactions[i]);
        newBtn.attr("data-name", reactions[i]);
        newBtn.addClass("reaction btn btn-info m-1");
        $("#buttons").append(newBtn);
    }

}

function displayGifs() {

    $("#gifs-appear-here").empty();

    var reaction = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + reaction + "&api_key=2GuZlr3V4NmdWt8DPnAjUoO38tsH5BPs&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        for (let i = 0; i < response.data.length; i++) {
            let newGifDiv = $("<div>");
            newGifDiv.addClass("float-left m-2");
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

            $("#gifs-appear-here").append(newGifDiv);
        }

    });

}

$(document).ready(function () {
    createButtons();

    $("#add-reaction").on("click", function () {

        event.preventDefault();
        let newReaction = $("#new-reaction").val().trim();
        var newBtn = $("<button>");
        $(newBtn).text(newReaction);
        newBtn.attr("data-name", newReaction);
        newBtn.addClass("reaction btn btn-info m-1");
        $("#buttons").append(newBtn);
        $("#new-reaction").val("");

    });

    $(document).on("click", ".reaction", displayGifs);

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
});