var data = {
	motsFavs: null,	

	init: function() {
		var motsFavs;
		/// populate are favourites
		this.favCategory = [];
		this.ajaxRequest(this.motsFavsData);
		// for (title in motsFavs) {
		// 	console.log(title);
		// }


	},
	motsFavsData: function(returned_data) {
    	data.motsFavs = returned_data;
    	console.log(data.motsFavs)
		data.genres = Object.keys(data.motsFavs)
		console.log(data.genres);
		// console.log(data.favCategory);
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
getFavGenre: function(index) {
	// console.log(index);
	// console.log(data.genres)
	var fav = data.genres[index]; 
	return fav;
},
getMovieData: function() {
	return data.motsFavs;
},

// generate random number
randomNum: function(max) {
	return Math.floor(Math.random() * max) + 1;
},

/// unique number generator
uniqueRandomNum: function(arr, tot, max) {
	console.log(arr)
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
		this.displayList = document.getElementById("displayList");
		this.modal = document.getElementById("trailerModal");
		this.favButtonArray = [];
		this.favButtonsRender();



		// controller.uniqueRandomNum(favButtonArray, 4, 9)
	},

	favButtonsRender: function() {
		controller.uniqueRandomNum(ui.favButtonArray, 4, 9)  // gets 4 random numbers

		console.log(ui.favButtonArray);
		for (var i = 0; i < 4; i ++) {
			var favbutton = document.createElement('div');
			favbutton.classList.add('columns', 'large-3', 'small-6', 'favlist', 'nav-link');
			var htmlString;
			var favouriteItem = controller.getFavGenre(ui.favButtonArray[i]);
			console.log(this.motsFavs[favouriteItem])
			htmlString = '<div class="wrapper">';
			htmlString += '<img src="' + this.motsFavs[favouriteItem].pic + '">';
			htmlString += '<div class="cloak">';
			htmlString += '<h3>' + favouriteItem + '</h3>';
			htmlString += '</div></div>';
			console.log(htmlString)
			favbutton.innerHTML = htmlString;
			this.displayList.appendChild(favbutton);
		}
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