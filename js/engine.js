

var favouriteMovieList = new MovieList();
var searchResult;

// var tempTrails = ["https://www.youtube.com/embed/dcUOO4Itgmw?autoplay=true&showinfo=0", "https://www.youtube.com/embed/bNYv4tBOsMc?autoplay=true&showinfo=0"]


var favButtonArray = [];
var posterList = [];

var mq = window.matchMedia( "(min-width: 600px)" );

var button;

var displayList = document.getElementById("displayList");

var modal = document.getElementById("trailerModal");

var favCategory = [];

var Animated = new Favourites("Animated");
favCategory.push(Animated);
var Australian = new Favourites("Australian");
favCategory.push(Australian);
var Comedy = new Favourites("Comedy");
favCategory.push(Comedy);
var Biography = new Favourites("Biography");
favCategory.push(Biography);
var Dystopian = new Favourites("Dystopian");
favCategory.push(Dystopian);
var Thriller = new Favourites("Thriller");
favCategory.push(Thriller);
var Music = new Favourites("Music");
favCategory.push(Music);
var Drama = new Favourites("Drama");
favCategory.push(Drama);
var War = new Favourites("War");
favCategory.push(War);

var posters = [];

$( document ).ready(function() {

$('#go').click(function() {
	var search = $('#search').val();
if (!search) { //ignore empty search field
		return
	} else {
		searchRequest(search);
	}	
});

$('.nav-link').click(function() {
	var qGenre = $(this).text();
	favRequest(qGenre, motsFavs[qGenre].titles);
	$('#status').html = "";
});

$('.stinkButton').click(function() {
	var qGenre = $(this).text();
	//console.log();
	favRequest(qGenre, motsFavs[qGenre].titles);
	$('#status').html = "";

})

uniqueRandomNum(favButtonArray, 4, 9)

// render favButtons 
var favs = document.querySelectorAll(".favlist");

for (var i = 0; i < favs.length; i ++) {

	var but = favCategory[favButtonArray[i]];
	favs[i].innerHTML = favCategory[favButtonArray[i]].toHTML();
}		

	$('#status').html = "Mots Favourite Movies by Genre";

//////  AJAX ////////////

var searchRequest = function(search) {
	
	var omdbAPI = "http://www.omdbapi.com/?";
	var omdbOptions = {
		t: search,
		plot: "short",
		r: "json"
	};
	function displayMovies(data) {
		if(data.Error == "Movie not found!") {
			$('#search').val("");
			$('#search').attr("placeholder", "...Sorry Movie not found");
		} else {
		var searchMoviesList = new MovieList();
		var omdbPoster = 'http://img.omdbapi.com/?i=' + data.imdbID + '&apikey=6c024fcd';
		searchResult = new Movie(omdbPoster, data.Title, data.Year, data.Director, data.Actors, data.Runtime, data.Genre, data.imdbRating, data.Plot, "search", null);
		searchMoviesList.add(searchResult);
		$('#status').html('<h3>Search results</h3>');
		searchMoviesList.render(displayList);
		}
	}

	$.getJSON(omdbAPI, omdbOptions, displayMovies);
	console.log(search);	
};

var favRequest = function(favGenre, movie) {
	favouriteMovieList.movies = [];
	if (favGenre != "Stinkers") {
		for (var i = 0; i < movie.length; i++) {
		ajaxRequest(movie[i], favGenre, motsFavs[favGenre].trailers[i]);  ///pass ajax function movie title, the genre list its from and a link to the trailer
		}

	} else {
		for (var i = 0; i < movie.length; i++) {
		ajaxRequest(movie[i], favGenre, motsFavs[favGenre].review[i]);  ///pass ajax function movie t
	}
}

	
};

function ajaxRequest(movie, favGenre, xfeature) {
	var omdbAPI = "http://www.omdbapi.com/?";
		var omdbOptions = {
			t: movie,
			plot: "short",
			r: "json"
		};
		function displayMovies(data) {
			var omdbPoster = 'http://img.omdbapi.com/?i=' + data.imdbID + '&apikey=6c024fcd';
			var favMovie = new Movie(omdbPoster, data.Title, data.Year, data.Director, data.Actors, data.Runtime, data.Genre, data.imdbRating, data.Plot, favGenre, xfeature);
			favouriteMovieList.add(favMovie);
			if (favGenre == "Stinkers") {
				$('#status').html('<h3>The Stinklist</h3>');				
			} else {
				$('#status').html('<h3>Mots Favourite ' + favGenre + ' movies</h3>');
			}	
			favouriteMovieList.render(displayList);
		}
		$.getJSON(omdbAPI, omdbOptions, displayMovies);
}

///  OBJECTS FOR ANIMATION  ///////

var Poster = function(title,x,y) {
	var self = this;
	this.title = title;
	this.x = x;
	this.y = y;
	this.index = 0;
	this.draw();
	posters.push(this);
	this.search = function() {
		console.log("searching");
		searchRequest(this.title)
	};
	this.button = document.getElementById(removeSp(this.title));
	this.button.addEventListener("click", function(e) {
		self.search();
	}, false);

}

Poster.prototype.draw = function() {
	var jpgLink = removeSp(this.title)
	var posHtml = '<div id="' + jpgLink + '" class="posterButton" data-name="' + this.title + '"><div class="cloak"></div></div>';
	this.posElement = $(posHtml);
	this.posElement.css({
		"background-image": 'url("img/animate/ps_' + jpgLink + '.jpg")',
		 position: "absolute",

		 left: this.x,
		 top: this.y
	})
	$("#slide3").append(this.posElement);
}

var Sprite = function(x, y) {
	this.index = 1;
	this.count = 1;
	this.x = x;
	this.y = y;
	this.imgWidth = 3900;
	this.imgHeight = 300; // maybe not needed? 
	this.xpos = 0;
	this.ypos = 0;
	this.numFrames = 10;
	this.frameSize = 390;
	this.reverse = false;
	this.draw();

}

Sprite.prototype.draw = function() {
            //multiplying by -1 because we want to move the image to the left and up to reveal the area we want to see.
            var animHtml = '<div class="sprite"></div>';
			this.animElement = $(animHtml);    
			this.animElement.css({
				"background-image": 'url("img/HomerSpriteSheet.jpg")', //' linear-gradient(90deg, rgba(170,87,69, 0) 0%,  #aa5745 35%)', 
				backgroundPosition: (-this.xpos)+"px "+(-this.ypos)+"px",
				width: this.frameSize,
				height: this.imgHeight,
				position: "absolute",
				left: this.x,
				top: this.y

			});        	
			$("#slide2").append(this.animElement);
}

Sprite.prototype.animate = function() {
           this.animElement.css({
            	backgroundPosition: (-this.xpos)+"px "+(-this.ypos)+"px"
            });  
            //each time around we add the frame size to our xpos, moving along the source image.
            this.xpos += this.frameSize;
            //increase the index so we know which frame of our animation we are currently on.
            this.index = this.index + this.count;
            //if our index is higher than our total number of frames, we're at the end and better start over.
	            if(this.index >= this.numFrames) {
	            //	console.log("reversed");
	            	this.reverse = true;
	                this.count *= -1; 
	                this.frameSize *= -1;
			    } else if (this.index <= 1) {
	            //	console.log("un-reversed");			    	
			    	this.reverse = false;
	                this.count *= -1; 
	                this.frameSize *= -1;
			    }
	}

//// This Poster wall should be improved into a proper object perhaps with a spritesheet //////

var homerAnim = new Sprite (0, 0);

var posterWall = [
	{x: 0, y: 0}, {x: 100, y: 0}, {x: 200, y: 0}, {x: 300, y: 0}, {x: 400, y: 0}, {x: 500, y: 0}, {x: 600, y: 0}, {x: 700, y: 0}, {x: 800, y: 0}, {x: 900, y: 0}, 
	{x: 0, y: 150}, {x: 100, y: 150}, {x: 200, y: 150}, {x: 300, y: 150}, {x: 400, y: 150}, {x: 500, y: 150}, {x: 600, y: 150}, {x: 700, y: 150}, {x: 800, y: 150}, {x: 900, y: 150}
]

var posterLinks = ["City of God", "Life of Pi", "Taxi Driver", "Ghosts Of The Civil Dead", "Dead Calm", "Gone Girl", "Flirting", "Electroma", "Withnail & I", "Block Party", "Ex Machina", "Nightcrawler", "Walk Hard", "Apocalypse Now", "Precious", "Revenge Of The Nerds", "Detachment", "The Year My Voice Broke", "Dirty Pretty Things", "Grave of the Fireflies", "Sideways", "Robocop", "District 9", "Paris Texas", "1984"]

// populate array with random poster names without duplicates 
uniqueRandomNum(posterList, posterWall.length, posterLinks.length);

for (var i = 0; i < posterWall.length; i++) {
	var picInstance = new Poster(posterLinks[posterList[i]] ,posterWall[i].x, posterWall[i].y);
}

//// Timer controlling Homer Animation  /////////

setInterval(function() {

  	homerAnim.animate();

}, 140);

});// end document ready