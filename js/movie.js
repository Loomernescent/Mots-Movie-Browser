function Movie(pic, title, year, director, actors ,duration, genre, rating, plot, type, xFeature) {
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
  		Trailer.call(this, xFeature);		
	} else {
		Review.call(this, xFeature);
	}; 		


}	

Movie.prototype = Object.create(Trailer.prototype);

Movie.prototype = Object.create(Review.prototype);


//Eloquent Javascript trick
Movie.prototype.properties = function() {
	var result = [];
	  for (var property in this) {
	    if (this.hasOwnProperty(property))
	      result.push(property);
	  }
	return result;
};


Movie.prototype.buttonHandler = function(id) {
				// console.dir(this);
				var movie = this; 
			    var button = document.getElementById(id)
			    button.addEventListener("click", movie.modal.bind(this), false);
}

Movie.prototype.renderHTML = function(list) {
	var $list = list;
	movieItem = '<div class="movie text-center clearfix">';
	movieItem += '<div><img class="pic" src="' + this.pic + '" alt="' + this.title +  '"></div>';
	movieItem += '<div><h3 class="title">' + this.title + '</h3><span> (' + this.year + ')  </span></div>';
	movieItem += '<span>' +  ' | ' + shortenStr(this.genre) + ' | ' + this.duration + ' | </span>';
	movieItem += '<span class="rating"><img src="img/fi-star.svg"><b>' + this.rating + '</b> /10 </span>';
	movieItem += '<ul>';
	movieItem += '<li class="entry"> Director: ' + this.director + ' | Starring: ' + this.actors + '</li>';
	movieItem += '<li class="entry">' + this.plot + '</li>';
	if(this.type !== "Stinkers" && this.type !== "search") {
		movieItem += '<li class="entry">' + this.videoButton.buttonHTML + '</li>';
	} else if (this.type == "Stinkers" && this.type != "search") {
		movieItem += '<li class="entry"><b>Mots thoughts: </b><i>' + this.review + '</i></li>';
	}
	movieItem += '</ul>';	
	movieItem += '</div>';
	var $entry = movieItem;
	$('#displayList').append($entry);

	if(this.type !== "Stinkers" && this.type !== "search") {
		this.buttonHandler(this.buttonID);
	}
}

function Trailer(trailer) {
	this.trailer = trailer;
	this.buttonID = removeSp(this.title)+ 'Trailer';
	this.videoButton = {
	buttonHTML: '<a href="#" id="' + this.buttonID + '" data-reveal-id="trailerModal" class="trailer button small radius success" href="#">Watch Trailer / Scene</a>'
	};
	this.modal = function(movie) {
		if(this.trailer == "" || this.trailer == undefined)	{
			return;
		} else {
			// console.log('modal action!')
			modal.innerHTML = "";
			var htmlString = '<div class="">';
			htmlString += '<h3>' + this.title + '</h3>';
			htmlString += '<div class="flex-video">';
			htmlString += '<iframe width="560" height="315" src="' + this.trailer + '" frameborder="0" allowfullscreen></iframe>';
			htmlString += '</div>';
			htmlString += '<a class="close-reveal-modal" aria-label="Close">&#215;</a>';
			htmlString += '</div>';

			modal.innerHTML = htmlString;
			$('.close-reveal-modal').click(function() {  //to stop video playing after modal closed wipe modal innerHTML
				modal.innerHTML = "";
			})
		}
	}	
}	

function Review(review) {
	this.review = review;
}
