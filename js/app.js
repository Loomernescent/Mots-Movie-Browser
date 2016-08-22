var MovieList = function() {
	this.movies = [];
}

var film;
var fuckyoulist = [];

MovieList.prototype.add = function(movie) {
	this.movies.push(movie);
	// console.log(this.movies.length)
}

var favouriteMovieList = new MovieList();

var MovieObject = function(pic, title, year, director, actors ,duration, genre, rating, plot, type, xFeature) {
	this.pic = pic;
	this.title = title;
	this.year = year;
	this.director = director;
	this.actors = actors;
	this.duration = duration;
	this.genre = genre;
	this.rating = rating;
	this.plot = plot;
	this.type = type;
	this.xFeature = xFeature;
	if (this.type != "Stinkers" && this.type != "search") {
  		// Trailer.call(this, xFeature);		
	} else {
		// Review.call(this, xFeature);
	};
}

var film = new MovieObject('http://img.omdbapi.com/?i=tt0387808&apikey=6c024fcd', 'Idoicracy', '2006', 'Mr Judge', 'McDood', '123 min', 'comdey', '6.6', 'fuck java', 'Comedy', 'https://www.youtube.com/embed/clYwX8Z43zg?autoplay=true&showinfo=0');
// var favouriteMovieList = new MovieList(); 
// favouriteMovieList.add(film);



var data = {
	motsFavs: null,
	init: function() {
		var motsFavs;
		// this.favouriteMovieList = new MovieList(); 
		this.favCategory = [];
		this.ajaxRequest(this.motsFavsData);
	},
	// MovieList: function() {
	// 	this.movies = [];
	// },

	// addToMovieList: function(movie) {
	// 	this.favouriteMovieList.movies.push(movie);			
	// },


	motsFavsData: function(returned_data) {
    	data.motsFavs = returned_data;
    	// console.log(data.motsFavs)
		data.genres = Object.keys(data.motsFavs)
		// console.log(data.genres);
		// data.genres.forEach(function(genre, index){
		// 	var favourite = new this.Favourites(genre);
		// 	data.favCategory.push(favourite)
		// }, this)
		// console.log(data.favCategory)
		ui.init();
	},
	// populateFavs: function() {

	// },

	ajaxRequest: function(callback) {
		var xmlhttp = new XMLHttpRequest();
		var url = "../data/movieData.json";

		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		        var myArr = JSON.parse(xmlhttp.responseText);
		        callback.apply(this,[myArr]);
		    }
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	},

	movieOmdbRequest: function (movie, favGenre, xfeature) {
		var omdbAPI = "http://www.omdbapi.com/?";
			var omdbOptions = {
				t: movie,
				plot: "short",
				r: "json"
			};
			function createMovie(returnData) {
				console.log('success')
				var omdbPoster = 'http://img.omdbapi.com/?i=' + returnData.imdbID + '&apikey=6c024fcd';
				var favMovie = {};
					favMovie.pic = omdbPoster;
					favMovie.title = returnData.Title;
					favMovie.year = returnData.Year;
					favMovie.director = returnData.Director;
					favMovie.actors = returnData.Actors;
					favMovie.duration = returnData.Runtime;
					favMovie.genre = returnData.Genre;
					favMovie.rating = returnData.imdbRating;
					favMovie.plot =  returnData.Plot;
					favMovie.type = favGenre;
					favMovie.xfeature = xfeature;
				// console.log(favMovie);
				favouriteMovieList.add(favMovie);
				ui.renderMovieList(favouriteMovieList.movies, favGenre)
			}
			$.getJSON(omdbAPI, omdbOptions, createMovie);
	},

		//mots favs data^
	// Favourites = function(genre) {

	// 	this.name = genre;
	// 	// console.log(genre);
	// 	this.pic = this.motsFavs[genre].pic;
	// 	this.favouritesList = this.motsFavs[genre].titles;
	// }




	// Favourites.prototype.toHTML = function() {
	// 	htmlString = '<div class="wrapper">';
	// 	htmlString += '<img src="' + this.pic + '">';
	// 	htmlString += '<div class="cloak">';
	// 	htmlString += '<h3>' + this.name + '</h3>';
	// 	htmlString += '</div></div>';
	// 	return htmlString;
	// } 
	
}; // end data object

var controller = {
		init: function() {
			data.init();
		},

//// HELPER FUNCTIONS /////

//Shorten string - used to shorten genre data from OMDB
shortenStr: function(str) {
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) === ',') {
			return str.substring(0, i);
		}
	}
	return str;
}, 

// remove spaces
removeSp: function(str) {
	str = str.replace(/\s/g,'');  
	return str;
},
getFavGenre: function(index) {
	// console.log(index);
	// console.log(data.genres)
	var fav = data.genres[index]; 
	return fav;
},
getMovieData: function() {
	return data.motsFavs;
},


buildFavouriteList: function(genre) {
	// this.favouriteMovieList = [];
	var genreObj = data.motsFavs[genre];
	if (genre != "Stinkers") {
		for (var i = 0; i < genreObj.titles.length; i++) {
		data.movieOmdbRequest(genreObj.titles[i], genre, genreObj.trailers[i]);  ///pass ajax function movie title, the genre list its from and a link to the trailer
		}

	} else {
		for (var i = 0; i < titlesList.length; i++) {
			data.movieOmdbRequest(genreObj.titles[i], genre, genreObj.review[i]);  ///pass ajax function movie t
		}	

	}
},


// generate random number
randomNum: function(max) {
	return Math.floor(Math.random() * max) + 1;
},

/// unique number generator
uniqueRandomNum: function(arr, tot, max) {
	while(arr.length < tot){
	  var r = controller.randomNum(max)-1
	  var found = false;
	  for(var i=0;i<arr.length;i++) {
		if(arr[i]== r) {
			found=true;break
		}
	  }
	  if(!found)arr[arr.length] = r;
	}
}

}; // end controller object


var ui = {
	init: function() {
		this.motsFavs = controller.getMovieData();
		this.status = document.getElementById('status');
		this.displayList = document.getElementById("displayList");
		this.modal = document.getElementById("trailerModal");
		this.favButtonArray = [];
		this.favButtonsRender();



		// controller.uniqueRandomNum(favButtonArray, 4, 9)
	},

	favButtonsRender: function() {
		controller.uniqueRandomNum(ui.favButtonArray, 4, 10)  // gets 4 random numbers

		for (var i = 0; i < 4; i ++) {
			var favButton = document.createElement('div');
			favButton.classList.add('columns', 'large-3', 'small-6', 'favlist', 'nav-link');
			var htmlString;
			var favouriteItem = controller.getFavGenre(ui.favButtonArray[i]);
			// console.log(this.motsFavs[favouriteItem])
			htmlString = '<div class="wrapper">';
			htmlString += '<img src="' + this.motsFavs[favouriteItem].pic + '">';
			htmlString += '<div class="cloak">';
			htmlString += '<h3>' + favouriteItem + '</h3>';
			htmlString += '</div></div>';

			favButton.innerHTML = htmlString;

			this.displayList.appendChild(favButton);
			favButton.addEventListener('click', function(e) {
				e.stopPropagation()  // ?????????????? is needed????????
				var genre = this.firstChild.children[1].firstChild.textContent;
				controller.buildFavouriteList(genre);
			}, true); 			

		}
	},

	renderMovieList: function(list, genre) {
		// this.movieList = favouriteMovieList;
		// // var movieList = list;
		// console.log(this.movieList.length);
		// console.log(list.length);
		// console.log(data.favouriteMovieList);
		if (genre == "Stinkers") {
			this.status.innerHTML = '<h3>The Stinklist</h3>';				
		} else {
			this.status.innerHTML = '<h3>Mots Favourite ' + genre + ' movies</h3>';
		};
		this.displayList.innerHTML = '';
		console.log(list.length)	
		list.forEach(function(movie, index, arr) {
			// var movie = favouriteMovieList[i];
			console.log(movie)
			var htmlStr = '';
			var movieEntry = document.createElement('div');
			movieEntry.classList.add('movie', 'text-center', 'clearfix');
			htmlStr += '<div><img class="pic" src="' + movie.pic + '" alt="' + movie.title +  '"></div>';
			htmlStr += '<div><h3 class="title">' + movie.title + '</h3><span> (' + movie.year + ')  </span></div>';
			htmlStr += '<span>' +  ' | ' + controller.shortenStr(movie.genre) + ' | ' + movie.duration + ' | </span>';
			htmlStr += '<span class="rating"><img src="img/fi-star.svg"><b>' + movie.rating + '</b> /10 </span>';
			htmlStr += '<ul>';
			htmlStr += '<li class="entry"> Director: ' + movie.director + ' | Starring: ' + movie.actors + '</li>';
			htmlStr += '<li class="entry">' + movie.plot + '</li>';
			if(movie.type !== "Stinkers" && movie.type !== "search") {
			// htmlStr += '<li class="entry">' + movie.videoButton.buttonHTML + '</li>';
			} else if (movie.type == "Stinkers" && movie.type != "search") {
			htmlStr += '<li class="entry"><b>Mots thoughts: </b><i>' + movie.review + '</i></li>';
			}
			htmlStr += '</ul>';	
			console.log(htmlStr)
			movieEntry.innerHTML = htmlStr;
			displayList.appendChild(movieEntry);

		}); 


		}


}; //end ui object

	// Favourites.prototype.toHTML = function() {
	// 	htmlString = '<div class="wrapper">';
	// 	htmlString += '<img src="' + this.pic + '">';
	// 	htmlString += '<div class="cloak">';
	// 	htmlString += '<h3>' + this.name + '</h3>';
	// 	htmlString += '</div></div>';
	// 	return htmlString;
	// } 

controller.init(); //start app