console.log("Loading books page");

let pageNumber;

let genreJson;
let themeJson;
let booksJson;

let radioId = 2;
let mainGroup = 'group0';
let genresGroup = 'group1'; //radiogroup for genres
let themesGroup = 'group2'; //radiogroup for themes
let ratingGroup = 'group3'; //radiogroup for rating

let genreid;
let themeid;
let rating;

let offset = 0;
let limit = 12;

$(document).ready(function(){
	//BOOKSBY SIDEBAR animation
  	$("#booksby").on("hide.bs.collapse", function(){
		$("#h6booksby").html('<i class="far fa-caret-square-down color-b"></i> Books By');
  	});
  	$("#booksby").on("show.bs.collapse", function(){
		$("#h6booksby").html('<i class="far fa-caret-square-up color-b"></i> Books By');
  	});
	//FILTERS SIDEBAR animation
	$("#filters").on("hide.bs.collapse", function(){
		$("#h6filters").html('<i class="far fa-caret-square-down color-b"></i> Filters');
  	});
  	$("#filters").on("show.bs.collapse", function(){
		$("#h6filters").html('<i class="far fa-caret-square-up color-b"></i> Filters');
  	});
	//PAGINATION
	$("#paginationDiv").on("click", "li.page-item", function() {
  		// remove classes from all
  		$("li.page-item").removeClass("active");
      	// add class to the one we clicked
      	$(this).addClass("active");

		offset = $(this).val() * limit;
		getBooks();
   	});
	//FILTERS
	$('#allFiltersDiv').on('change', 'input[type=radio]', function() {
		switch(this.name){
			case mainGroup:
				break;
			case genresGroup:
				genreid = this.value;
				break;
			case themesGroup:
				themeid = this.value;
				break;
			case ratingGroup:
				rating = this.value;
				break;
			default:
				return;
		}
		offset = 0;
		getBooksCount();
		getBooks();
	});
	
	
	getBooksCount();
	getGenres();
	getThemes();
	generatesRatingFilterHTML();
	getBooks();
});

// -------------- REQUESTS ---------------

function getBooksCount(){
	var query = '?offset=' + offset + '&limit=' + limit;
	if(genreid) query += '&genre=' + genreid;
	if(themeid) query += '&theme=' + themeid;
	if(rating) query += '&rating=' + rating;
	
	fetch('/books/count' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		pageNumber = json.count;
		if(pageNumber){
			$("#paginationDiv").empty(); 
			pageNumber = Math.ceil(pageNumber/limit);
			console.log('pages:' + pageNumber);
			generatesPaginationHTML();
		}
 	});
}

function getGenres(){
	fetch('/genres').then(function(response) {
		return response.json();
	}).then(function(json) {
		genreJson = json;
		if(!jQuery.isEmptyObject(genreJson)){
			generatesGenresFilterHTML();
		}
 	});
}

function getThemes(){
	fetch('/themes').then(function(response) {
		return response.json();
	}).then(function(json) {
		themeJson = json;
		if(!jQuery.isEmptyObject(themeJson)){
			generatesThemesFilterHTML();
		}
 	});
}

function getBooks(){
	var query = '?offset=' + offset + '&limit=' + limit;
	if(genreid) query += '&genre=' + genreid;
	if(themeid) query += '&theme=' + themeid;
	if(rating) query += '&rating=' + rating;
	
	console.log(query);
	
	fetch('/books' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		booksJson = json;
		$("#booksDiv").empty();
		console.log(booksJson);
		if(!jQuery.isEmptyObject(booksJson)){
			generatesBooksHTML();
		}else{
			$("#booksDiv").append( 
				'<h3 class="title-single">No Books available with the current filters selection.</h3>'
			);
		}
 	});
}

// -------------- GENERATES HTML ---------------

function generatesPaginationHTML(){
	
	for(i = 0; i < pageNumber; i++){
		$("#paginationDiv").append( 
			`
				<li value="${i}" class="page-item` + (i==0 ? ` active` : ``)  + `">
					<a class="page-link">${i+1}</a>
				</li>
			`
		);
	}
}

function generatesGenresFilterHTML(){
	var genresHTML = 
		`
			<div class="filter-div-title" data-toggle="collapse" data-target="#genreDiv"><i class="fa fa-angle-right color-b"></i> <a>Genre</a></div>
			<div id="genreDiv" class="collapse">
				<div class="form-check">
					<input name="${genresGroup}" type="radio" id="radio${++radioId}" value="0" checked>
					<label for="radio${radioId}">All</label>
				</div>
		`;
	for(i = 0; i < genreJson.length; i++){
		var currentGenre = genreJson[i];
		genresHTML += 
			`
				<div class="form-check">
					<input name="${genresGroup}" type="radio" id="radio${++radioId}" value="${currentGenre.id_genre}">
					<label for="radio${radioId}">${currentGenre.name}</label>
				</div>
			`
	}	
	$("#filtersDiv").append( 
		genresHTML +=`</div>`
	);
}

function generatesThemesFilterHTML(){
	var themesHTML = 
		`
			<div class="filter-div-title" data-toggle="collapse" data-target="#themeDiv"><i class="fa fa-angle-right color-b"></i> <a>Theme</a></div>
			<div id="themeDiv" class="collapse">
				<div class="form-check">
					<input name="${themesGroup}" type="radio" id="radio${++radioId}" value="0" checked>
					<label for="radio${radioId}">All</label>
				</div>
		`;
	for(i = 0; i < themeJson.length; i++){
		var currentTheme = themeJson[i];
		themesHTML += 
			`
				<div class="form-check">
					<input name="${themesGroup}" type="radio" id="radio${++radioId}" value="${currentTheme.id_theme}">
					<label for="radio${radioId}">${currentTheme.theme_name}</label>
				</div>
			`
	}
	$("#filtersDiv").append( 
		themesHTML +=`</div>`
	);
}

function generatesRatingFilterHTML(){
	var maxrating = 5;
	var ratingHTML = 
		`
			<div class="filter-div-title" data-toggle="collapse" data-target="#ratingDiv"><i class="fa fa-angle-right color-b"></i> <a>Rating</a></div>
			<div id="ratingDiv" class="collapse">
				<div class="form-check">
					<input name="${ratingGroup}" type="radio" id="radio${++radioId}" value="0" checked>
					<label for="radio${radioId}">All</label>
				</div>
		`;
	for(i = 0; i < maxrating; i++){
		ratingHTML += 
			`
				<div class="form-check">
					<input name="${ratingGroup}" type="radio" id="radio${++radioId}" value="${maxrating-i}">
					<label for="radio${radioId}">
			`;
		for(x = i; x < maxrating; x++){
			ratingHTML += `<i class="fas fa-star color-b" aria-hidden="true"></i>`;
		}
		for(y = maxrating-i; y < maxrating; y++){
			ratingHTML += `<i class="far fa-star color-b" aria-hidden="true"></i>`;
		}
		ratingHTML += `</label></div>`;
		
	}
	$("#filtersDiv").append( 
		ratingHTML +=`</div>`
	);
}

function generatesBooksHTML(){		
	for(i = 0; i < booksJson.length; i++){
		var currentBook = booksJson[i];
		$("#booksDiv").append( 
			`
				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
					<div class="">
						<div class="img-box-a">
						  <a href="book.html?id=${currentBook.id_book}"><img src="${currentBook.cover_img}" alt="${currentBook.title}" class="img-a img-fluid"></a>
						</div>

					</div>
					<div class="book_desc">
						<h5 class="card-titl-a book_author"><a href="author.html?id=${currentBook.id_author}">${currentBook.name}</a></h5> 
						<h6 class="card-titl-a book_title"><a href="book.html?id=${currentBook.id_book}"><i>${currentBook.title}</i></a></h6>
						<div class="book_rating">
							<p>
								<span class="rating_text">Rating</span>
									`+ ratingHTML(currentBook.rating) +
			`
								<br><span class="price_text">price</span> 
									<strong class="color-b">€ 
									`+ priceHTML(currentBook.support, currentBook.price_paper, currentBook.price_eBook) +
									`																		
									</strong>
							</p>
						</div>
					</div>
				</div>
			`
		);
	}
}

// -------------- AUXILIARY FUNCTIONS ---------------

function ratingHTML(rating){
	var star = ``;
	for(x = 0; x < rating; x++)
		star += `<i class="fas fa-star color-b" aria-hidden="true"></i>`;
	for(y = 0; y < 5-rating; y++)
		star += `<i class="far fa-star color-b" aria-hidden="true"></i>`;
	return star;
}

function priceHTML(support, price_paper, price_eBook){
	switch(support){
		case 'eBook':
			return price_eBook;
		case 'paper':
		case 'both':
			return price_paper;
		default:
			return 'NaN';
	}
}