//initial buttons array
var topics = ["dogs","puppies","kitties","cats","snowboarding",
				"skateboarding","surfing","deadmau5","EDC","physics",
				"NBA","kobe","kyrie","lebron","westbrook","one piece",
				"Game of Thrones","Rick and Morty","Silicon Valley"];

//populate gifs from GIPHY
function popGifs(results){
	$("#search-results").empty();
	for (var i = 0; i < results.length; i++) {
        var gifDiv = $("<div class='item'>");

        var rating = results[i].rating;

        var p = $("<p>").text("Rating: " + rating);

        var gif = $("<img>");
        gif.attr("src", results[i].images.fixed_height_still.url);
        gif.addClass("gif");
        gif.attr("data-still",results[i].images.fixed_height_still.url);
        gif.attr("data-animate",results[i].images.fixed_height.url);
        gif.attr("data-state","still");
        gif.attr("onclick","playGif(this)");

        gifDiv.prepend(p);
        gifDiv.prepend(gif);

        $("#search-results").prepend(gifDiv);
    }
}
//play still gifs
function playGif(data) {
      var state = $(data).attr("data-state");

      if(state === "still"){
        $(data).attr("src",$(data).attr("data-animate")).attr("data-state","animate");
      }else{
        $(data).attr("src",$(data).attr("data-still")).attr("data-state","still");
      }
 }

//on document load, populate buttons with elements from topics array
$(document).ready(function(){
	var limit;
	var rating;
	var searchTerm;  
	var allClick = false;

	//trying to do local storage
	if (typeof(Storage) !== "undefined" && localStorage.getItem("topics") !== null) {
	    topics = JSON.parse(localStorage.getItem("topics"));
	}

	for (var i=0;i<topics.length;i++){
		var toAdd = $("<button>").text(topics[i]).attr("value",topics[i]);
		toAdd.addClass("btn").addClass("searchbtn");
		$("#search-buttons").prepend(toAdd);
		topics[i] = topics[i].toLowerCase();
	}
//CLICK EVENTS
	//buttons in top row
	$(".searchbtn").on("click", function(){
		limit=$("#search-limit").val();
		rating=$("#search-rating").val();
		searchTerm=$(this).attr("value");
		var queryURL =  "https://api.giphy.com/v1/gifs/search?q="+searchTerm+
					"&limit="+limit+"&rating="+rating+"&api_key=cd350dd864d84836ad184da0c29f894c";
		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response){
			var results = response.data;
			popGifs(results);
		});
		
	});
	//submit new search info
	$("#submit-search-info").on("click",function(event){
		event.preventDefault();
		limit=$("#search-limit").val();
		rating=$("#search-rating").val();
		searchTerm = $("#search-term").val().trim();
		var lower = searchTerm.toLowerCase();
		if(searchTerm!=''){
			if(topics.indexOf(lower) === -1){
				var toAdd = $("<button>").text(searchTerm).attr("value",searchTerm);
				toAdd.addClass("btn").addClass("searchbtn");
				$("#search-buttons").prepend(toAdd);
				topics.push(lower);
				localStorage.clear();
				localStorage.setItem("topics",JSON.stringify(topics));
			}
			var queryURL =  "https://api.giphy.com/v1/gifs/search?q="+searchTerm+
						"&limit="+limit+"&rating="+rating+"&api_key=cd350dd864d84836ad184da0c29f894c";
			$.ajax({
				url: queryURL,
				method: "GET"
			}).done(function(response){
				var results = response.data;
				popGifs(results);
			});
		}
	});
	//toggle stop/start of all gifs (play or pause all together)
    $("#toggle-all").on("click",function() {
      allClick = !allClick;
      $(".gif").each(function(){
        if($(this).attr("data-state") === "still" && allClick){
          $(this).attr("data-state","animate");
          $(this).attr("src",$(this).attr("data-animate"));
        }else if($(this).attr("data-state") === "animate" && !allClick){
          $(this).attr("data-state","still");
          $(this).attr("src",$(this).attr("data-still"));          
        }
      });
    })
    //clear search results
	$("#clear-results").on("click", function(event) {
		event.preventDefault();
		$("#search-results").empty();
	})

});