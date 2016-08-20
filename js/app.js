var Favourites = function(genre) {

	this.name = genre;
	console.log(genre);
	this.pic = motsFavs[genre].pic;
	this.favouritesList = motsFavs[genre].titles;
}

var data = {


	init: function() {
		var motsFavs;
		/// populate are favourites
		this.favCategory = [];
		this.ajaxRequest(this.motsFavsData);
		for (title in motsFavs) {
			console.log(title);
		}


	},
	motsFavsData: function(returned_data) {
    	motsFavs = returned_data;
    	console.log(motsFavs)
		var genres = Object.keys(motsFavs)
		console.log(genres);
		console.log(data.favCategory);
		genres.forEach(function(genre, index){
			var favourite = new Favourites(genre);
			data.favCategory.push(favourite)
		}, this)
		console.log(data.favCategory)
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


		//mots favs data^





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

// 		searchRequest: function(search) {
		
// 		var omdbAPI = "http://www.omdbapi.com/?";
// 		var omdbOptions = {
// 			t: search,
// 			plot: "short",
// 			r: "json"
// 		};
// 		function displayMovies(data) {
// 			if(data.Error == "Movie not found!") {
// 				$('#search').val("");
// 				$('#search').attr("placeholder", "...Sorry Movie not found");
// 			} else {
// 			var searchMoviesList = new MovieList();
// 			var omdbPoster = 'http://img.omdbapi.com/?i=' + data.imdbID + '&apikey=6c024fcd';
// 			searchResult = new Movie(omdbPoster, data.Title, data.Year, data.Director, data.Actors, data.Runtime, data.Genre, data.imdbRating, data.Plot, "search", null);
// 			searchMoviesList.add(searchResult);
// 			$('#status').html('<h3>Search results</h3>');
// 			searchMoviesList.render(displayList);
// 			}
// 		}

// 	$.getJSON(omdbAPI, omdbOptions, displayMovies);
// 	console.log(search);	
// };


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

// generate random number
randomNum: function(max) {
	return Math.floor(Math.random() * max) + 1;
},

/// unique number generator
uniqueRandomNum: function(arr, tot, max) {
	while(arr.length < tot){
	  var r = randomNum(max)-1
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
		this.displayList = document.getElementById("displayList");
		this.modal = document.getElementById("trailerModal");


		this.favButtonArray = [];
		// controller.uniqueRandomNum(favButtonArray, 4, 9)
	},

	favButtonsRender: function() {
		for (var i = 0; i < 5; i ++) {
			console.log(i)
			var favbutton = document.createElement('div');
			favbutton.classList.add('columns', 'large-3', 'small-6', 'favlist', 'nav-link');



		}
	}

}; //end ui object



controller.init(); //start app