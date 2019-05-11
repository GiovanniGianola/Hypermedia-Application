console.log("Loading events page");

let eventsJson;
let this_month;

let offset = 0;
let limit = 6;

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

$(document).ready(function(){
    
    //PAGINATION
	$("#pagDiv").on("click", "li.page-item", function() {
  		// remove classes from all
  		$("li.page-item").removeClass("active");
      	// add class to the one we clicked
      	$(this).addClass("active");

		offset = $(this).val() * limit;
		getEvents();
   	});
    
    $("select.custom-select").change(function(){
        this_month = $(this).children("option:selected").val();
        getEvents();
    });
    getEventsCount();
	getEvents();
});

function getPage(num){
    console.log("num: " + num);
    offset = (num-1)*limit;
    getEvents();
}

function getEvents(){
    var query = '?offset=' + offset + '&limit=' + limit;
	if(this_month) query += '&current_month=' + this_month;
    
	fetch('/events' + query).then(function(response) {
		return response.json();
	 }).then(function(json) {
		eventsJson = json;
        $("#eventsDiv").empty();
        if(!jQuery.isEmptyObject(eventsJson)){
			generatesHTML();
		}else{    
			$("#eventsDiv").append( 
				'<h3 class="title-single">No Events available.</h3>'
			);
		}
	 });
}

function getEventsCount(){
    
	var query = '?offset=' + offset + '&limit=' + limit;
    
    fetch('/events/count' + query).then(function(response) {
		return response.json();
	 }).then(function(json) {
        pageNumber = json.count;
		if(pageNumber){
			$("#pagDiv").empty(); 
			pageNumber = Math.ceil(pageNumber/limit);
            
			generatesPaginationHTML();
		}
	 });
}

function generatesHTML(){
    console.log(eventsJson);
	for(i = 0; i < eventsJson.length; i++){
		$("#eventsDiv").append( 
			`
				<div class="col-md-4">
                  <div class="card-box-b card-shadow news-box">
                    <div class="img-box-b">
                      <img src="${eventsJson[i].img}" alt="" class="img-b img-fluid">
                    </div>
                    <div class="card-overlay">
                      <div class="card-header-b">
                        <div class="card-category-b">
                          <a href="#" class="category-b"><i class="fas fa-map-marker-alt"></i>
                                    ${eventsJson[i].city}</a>
                        </div>
                        <div class="card-title-b">
                          <h2 class="title-2">
                            <a href="event.html">${eventsJson[i].name}
                          </h2>
                        </div>
                        <div class="card-date">
                          <span class="date-b">${eventsJson[i].date_day} ${month[eventsJson[i].date_month]} ${eventsJson[i].date_year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
			`
		);
	}
}

function generatesPaginationHTML(){
	for(i = 0; i < pageNumber; i++){
		$("#pagDiv").append( 
			`
				<li value="${i}" class="page-item` + (i==0 ? ` active` : ``)  + `">
					<a class="page-link">${i+1}</a>
				</li>
			`
		);
	}
}
