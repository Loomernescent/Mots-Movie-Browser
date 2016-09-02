/// Data Object

function data() {
	motsFavs: null,
	this.favPosters = [{title: "City of God", xpos: 0, ypos: 0}, {title: "Life of Pi", xpos: -101, ypos: 0},
					 {title: "Taxi Driver", xpos: -201, ypos: 0}, {title: "Ghosts Of The Civil Dead", xpos: -301, ypos: 0},
					 {title: "Dead Calm", xpos: -401, ypos: 0}, {title: "Gone Girl", xpos: -501, ypos: 0},
					 {title: "Flirting", xpos: -601, ypos: 0}, {title: "Electroma", xpos: -701, ypos: 0},
					 {title: "Withnail & I", xpos: -801, ypos: 0}, {title: "Dirty Pretty Things", xpos: -901, ypos: 0},
					 {title: "Block Party", xpos: 0, ypos: 150}, {title: "Ex Machina", xpos: -101, ypos: 150},
					 {title: "Nightcrawler", xpos: -201, ypos: 150}, {title: "Walk Hard", xpos: -301, ypos: 150},
					 {title: "Apocalypse Now", xpos: -401, ypos: 150}, {title: "Precious", xpos: -501, ypos: 150},				 
					 {title: "Revenge Of The Nerds", xpos: -601, ypos: 150}, {title: "Detachment", xpos: -701, ypos: 150},
					 {title: "The Year My Voice Broke", xpos: -801, ypos: 150}, {title: "Sideways", xpos: -901, ypos: 150},
					 {title: "Paris Texas", xpos: -801, ypos: 150}, {title: "History of the world part I", xpos: -901, ypos: 150}	 
					]
	this.init = function() {
		var motsFavs;
		this.ajaxRequest(this.motsFavsData);
	};

	this.motsFavsData = function(returned_data) {
    	data.motsFavs = returned_data;
		data.genres = Object.keys(data.motsFavs)
		ui.init();
	};

	this.MovieObject = function(pic, title, year, director, actors ,duration, genre, rating, plot, type, xFeature) {
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
		if (this.type != "Stinkers" && this.type != "search") {
	  		data.Trailer.call(this, xFeature);		
			this.xFeature = xFeature;
		} else {
			this.review = xFeature; // Review.call(this, xFeature);
		};
	};

	this.Trailer = function(trailer) {

		this.trailer = trailer;
		this.buttonID = controller.removeSp(this.title)+ 'Trailer';  /// this button ID maybe redundant now with changes to the mov
		this.videoButton = {
			buttonHTML: '<a href="#" id="' + this.buttonID + '" data-reveal-id="trailerModal" class="trailer button small radius success" href="#">Watch Trailer / Scene</a>',
		};
		this.modal = function(movie) {
			if(this.trailer == "" || this.trailer == undefined)	{
				console.log('denied')
				return;
			} else {
				ui.modal.innerHTML = "";
				var htmlString = '<div class="">';
				htmlString += '<h3>' + this.title + '</h3>';
				htmlString += '<div class="flex-video">';
				htmlString += '<iframe width="560" height="315" src="' + this.trailer + '" frameborder="0" allowfullscreen></iframe>';
				htmlString += '</div>';
				htmlString += '<a class="close-reveal-modal" aria-label="Close">&#215;</a>';
				htmlString += '</div>';

				ui.modal.innerHTML = htmlString;
				$('.close-reveal-modal').click(function() {  //to stop video playing after modal closed wipe modal innerHTML
					ui.modal.innerHTML = "";
				})
			}
			}	
	};	

	this.prototype = Object.create(this.Trailer.prototype);

	this.ajaxRequest = function(callback) {
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
	};

	this.movieOmdbRequest = function (movie, favGenre, xfeature) {
		var callback;
		if (favGenre == "search") {
			callback = createSearchResult;
			console.log(favGenre + " search")
		} else {
			callback = createMovie;			
		}

		var omdbAPI = "http://www.omdbapi.com/?";
			var omdbOptions = {
				t: movie,
				plot: "short",
				r: "json"
			};
			function createMovie(movData) {
					var omdbPoster = 'http://img.omdbapi.com/?i=' + movData.imdbID + '&apikey=6c024fcd';
					var favMovie = new data.MovieObject(omdbPoster, movData.Title, movData.Year, movData.Director, movData.Actors, movData.Runtime, movData.Genre, movData.imdbRating, movData.Plot, favGenre, xfeature)
					ui.renderMovieCard(favMovie, favGenre)
				}
			
			function createSearchResult(movData) {
				if(movData.Error == "Movie not found!") {
					$('#search').val("");
					$('#search').attr("placeholder", "...Sorry Movie not found");
				} else {
					ui.updateStatus('search'); 
					createMovie(movData); 
				}
			}
			$.getJSON(omdbAPI, omdbOptions, callback);
	};
	
}; // end data object

// Controller Object
function controller() {
		this.init = function() {
			data.init();
		};

	this.getFavGenre = function(index) {
		var fav = data.genres[index]; 
		return fav;
	};
	this.getMovieData = function() {
		return data.motsFavs;
	};

	this.buildFavouriteList = function(genre) {
		ui.updateStatus(genre);
		var genreObj = data.motsFavs[genre];
		if (genre != "Stinkers") {
			for (var i = 0; i < genreObj.titles.length; i++) {
			data.movieOmdbRequest(genreObj.titles[i], genre, genreObj.trailers[i]);  ///pass ajax function movie title, the genre list its from and a link to the trailer
			}

		} else {
			for (var i = 0; i < genreObj.titles.length; i++) {
				data.movieOmdbRequest(genreObj.titles[i], genre, genreObj.review[i]);  ///pass ajax function movie t
			}	

		}
	};

	this.search = function(search) {
		console.log(search);
		data.movieOmdbRequest(search, "search", null);			
	}

	this.getPosterData = function(index) {
		return data.favPosters[index];
	}

//// HELPER FUNCTIONS /////

	//Shorten string - used to shorten genre data from OMDB
	this.shortenStr = function(str) {
		for (var i = 0; i < str.length; i++) {
			if (str.charAt(i) === ',') {
				return str.substring(0, i);
			}
		}
		return str;
	};

	// remove spaces
	this.removeSp = function(str) {
		str = str.replace(/\s/g,'');  
		return str;
	};

	// generate random number
	this.randomNum = function(max) {
		return Math.floor(Math.random() * max) + 1;
	}

	/// unique number generator
	this.uniqueRandomNum = function(arr, tot, max) {
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
	};

	}; // end controller object

/// User Interface Object

function ui() {
	this.init = function() {
		this.homerAnim = new this.Sprite (0, 0);
		this.slide2 = document.getElementById('slide2')
		this.slide3 = document.getElementById('slide3')	
		this.creatPosterWall();
		this.motsFavs = controller.getMovieData();
		this.status = document.getElementById('status');
		this.displayList = document.getElementById('displayList');
		this.modal = document.getElementById('trailerModal');
		this.modalTitle = document.getElementById('modalTitle');
		this.modalVideo = document.getElementById('modalVideo');
		this.favButtonArray = [];
		this.favButtonsRender();
		$('.nav-link').click(function() {
			var genre = $(this).text();
			controller.buildFavouriteList(genre);
		});
		$('.stinkButton').click(function() {
			var genre = $(this).text();
			controller.buildFavouriteList(genre);
		});
		$('#go').click(function() {
			var search = $('#search').val();
			if (!search) { //ignore empty search field
				return
			} else {
				controller.search(search);
			}	
		});
	};

	this.Sprite = function(x, y) {
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
	};

	this.Sprite.prototype = {
		draw: function() {
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
		}, 
		animate: function() {
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
	};

	this.creatPosterWall = function() {
		this.posterWall = [];
		var self = this;
		var search = function() {
			controller.search(this.title)
		}
		for (var i = 0; i < 20; i++) {
			var poster = new Object()
			poster.index = i;
			poster.imgWidth = 1000;
			poster.imgHeight = 300;
			poster.nFrames = 20;

			if (i < 10) {
				poster.x = i * 100 
				poster.y = 0				
			} else {
				poster.x = (i -10) * 100 
				poster.y = 150					
			}

			poster.div = document.createElement('div')
			var data = controller.getPosterData(poster.index);
			$.extend(poster, data)
			this.posterWall.push(poster);	
		}
		var arrLength = this.posterWall.length
		for(var j = 0; j < 20; j++) {
			var elem = this.posterWall[j].div;
			elem.classList.add('posterButton');
			// elem.dataset.title = this.posterWall[j].title;
			elem.style.backgroundImage = 'url("img/PosterSpriteSheet.jpg")';
			elem.style.backgroundPosition = this.posterWall[j].index * -100 -1 + "px " +  "0px";
			// elem.style.border = "solid 1px #222"
			elem.style.width = "100px";
			elem.style.height = "150px"; 
		 	elem.style.position = "absolute";
     		elem.style.left = this.posterWall[j].x +"px";
		    elem.style.top = this.posterWall[j].y +"px";
		    
		    elem.addEventListener('click', function(e) {
		    	console.log(e.target)
		    	controller.search(e.target.dataset.title)
		    }, false)
		    elem.innerHTML = '<div class="cloak" data-title="' + this.posterWall[j].title + '"></div>';
		    this.slide3.appendChild(elem);
		}
	}

	this.udpdateAnimations = function() {
		// Slide 2 is active play animation
		if (this.slide2.parentNode.classList.contains('active')) {
			this.homerAnim.animate();
		}

	}

	this.updateStatus = function(genre) {
		if (genre == "Stinkers") {
			this.status.innerHTML = '<h3>The Stinklist</h3>';	
		} else if (genre ==  "search") {
			this.status.innerHTML = '<h3>Search Results</h3>'
		} else {
			this.status.innerHTML = '<h3>Mots Favourite ' + genre + ' movies</h3>';
		};
		this.displayList.innerHTML = '';
	};

	this.favButtonsRender = function() {
		controller.uniqueRandomNum(ui.favButtonArray, 4, 10)  // gets 4 random numbers

		for (var i = 0; i < 4; i ++) {
			var favButton = document.createElement('div');
			var spinner = document.createElement('img');
			spinner.src = "img/gears.svg";
			spinner.classList.add('spinner');
			favButton.classList.add('columns', 'large-3', 'small-6', 'favlist', 'nav-link');
			var htmlString;
			var favouriteItem = controller.getFavGenre(ui.favButtonArray[i]);
			htmlString = '<div class="wrapper">';
			htmlString += '<img src="' + this.motsFavs[favouriteItem].pic + '">';
			htmlString += '<div class="cloak">';
			htmlString += '<h3>' + favouriteItem + '</h3>';
			htmlString += '</div></div>';

			favButton.innerHTML = htmlString;
			favButton.appendChild(spinner);

			this.displayList.appendChild(favButton);
			favButton.addEventListener('click', function(e) {
				e.stopPropagation()  // ?????????????? is needed????????
				var genre = this.firstChild.children[1].firstChild.textContent;
				controller.buildFavouriteList(genre);
			}, true);
			favButton.firstChild.children[0].addEventListener('load', function() {
				// console.log(this)
				// console.log(this.parentNode.parentNode)

				var throwawayNode = this.parentNode.parentNode.lastElementChild;
				// console.log(throwawayNode)
				throwawayNode.parentNode.removeChild(throwawayNode);

			}) 			

		}
	};

	this.renderMovieCard = function(movie, genre) {
			var htmlStr = '';
			var movieEntry = document.createElement('div');
			var spinner = document.createElement('img');
			spinner.src = "img/gears.svg";
			spinner.classList.add('AJAXspinner');
			movieEntry.classList.add('movie', 'text-center', 'clearfix');


			htmlStr += '<div><img class="pic" src="' + movie.pic + '" alt="' + movie.title +  '"></div>';
			htmlStr += '<div><h3 class="title">' + movie.title + '</h3><span> (' + movie.year + ')  </span></div>';
			htmlStr += '<span>' +  ' | ' + controller.shortenStr(movie.genre) + ' | ' + movie.duration + ' | </span>';
			htmlStr += '<span class="rating"><img src="img/fi-star.svg"><b>' + movie.rating + '</b> /10 </span>';
			htmlStr += '<ul class="info-list">';
			htmlStr += '<li class="entry"> Director: ' + movie.director + ' | Starring: ' + movie.actors + '</li>';
			htmlStr += '<li class="entry">' + movie.plot + '</li>';
			if(movie.type !== "Stinkers" && movie.type !== "search") {
				htmlStr += '<li class="entry">' + movie.videoButton.buttonHTML + '</li>';
			} else if (movie.type == "Stinkers" && movie.type != "search") {
				htmlStr += '<li class="entry"><b>Mots thoughts: </b><i>' + movie.review + '</i></li>';
			}
			htmlStr += '</ul>';	
			htmlStr += '</div>';
			movieEntry.innerHTML = htmlStr;
			movieEntry.firstChild.appendChild(spinner);
			console.log(movieEntry.firstChild.children[0]); ///thats it
			if(movie.type !== "Stinkers" && movie.type !== "search") {
				movieEntry.lastChild.lastChild.firstChild.addEventListener('click', function() {
					movie.modal(movie)
				})
			}

			displayList.appendChild(movieEntry);
			movieEntry.firstChild.children[0].addEventListener('load', function() {
				console.log(this + ' loaded')
				var throwawayNode = this.parentNode.lastElementChild;
				console.log(throwawayNode)
				throwawayNode.parentNode.removeChild(throwawayNode);	
			})
		};

}; //end ui object

// initiate application and timer
var data = new data(),
    ui = new ui(),
    controller = new controller();

controller.init();


setInterval(function() {

		ui.udpdateAnimations();

}, 140);





