//Model
//We have three types of locations : "Museums", "Shopping Mall", "Monuments", we call every one after another
var locations = [];
$.ajax({
          type: 'GET',
          dataType: 'json',
          url: "https://api.foursquare.com/v2/venues/explore/?near=Egypt&venuePhotos=1&query=museum&oauth_token=C4PCBFORQB10EVE1QEXJW5LAWUTAMSMMRTXBEK3YAHPUUFOQ&v=20170416",
          timeout: 5000,
          success: function(data, textStatus ){
            $.each(data.response.groups[0].items, function(index, element) {
              if(element.venue.photos.count > 0)
            		var photo = element.venue.photos.groups[0].items[0].prefix+"width540"+element.venue.photos.groups[0].items[0].suffix;
            	else
            		var photo = "";
              tempObj = {id: index+1, 
              			title: element.venue.name, 
              			location: {lat: element.venue.location.lat, lng: element.venue.location.lng}, 
              			photo: photo,
              			type: 'Museums'};
              locations.push(tempObj);
             });
            getMalls(called=true);
            
            $( "#wrongmsg" ).html("");
          },
          error: function(xhr, textStatus, errorThrown){
             $( "#wrongmsg" ).html("something went wrong..");
          }
        });

function getMalls(called=false) {
	if(called) {
	$.ajax({
          type: 'GET',
          dataType: 'json',
          url: "https://api.foursquare.com/v2/venues/explore/?near=Egypt&venuePhotos=1&query=Shopping Mall&oauth_token=C4PCBFORQB10EVE1QEXJW5LAWUTAMSMMRTXBEK3YAHPUUFOQ&v=20170416",
          timeout: 5000,
          success: function(data, textStatus ){
            $.each(data.response.groups[0].items, function(index, element) {
            	if(element.venue.photos.count > 0)
            		var photo = element.venue.photos.groups[0].items[0].prefix+"width540"+element.venue.photos.groups[0].items[0].suffix;
            	else
            		var photo = "";
              tempObj = {id: index+1, 
              			title: element.venue.name, 
              			location: {lat: element.venue.location.lat, lng: element.venue.location.lng}, 
              			photo: photo,
              			type: 'Shopping Mall'};
              locations.push(tempObj);
             });
            getMonuments(called=true);
            $( "#wrongmsg" ).html("");
          },
          error: function(xhr, textStatus, errorThrown){
             $( "#wrongmsg" ).html("something went wrong..");
          }
        });
	}
}

function getMonuments(called=false) {
	if(called) {
	$.ajax({
          type: 'GET',
          dataType: 'json',
          url: "https://api.foursquare.com/v2/venues/explore/?near=Egypt&venuePhotos=1&query=monuments&oauth_token=C4PCBFORQB10EVE1QEXJW5LAWUTAMSMMRTXBEK3YAHPUUFOQ&v=20170416",
          timeout: 5000,
          success: function(data, textStatus ){
            $.each(data.response.groups[0].items, function(index, element) {
            	if(element.venue.photos.count > 0)
            		var photo = element.venue.photos.groups[0].items[0].prefix+"width540"+element.venue.photos.groups[0].items[0].suffix;
            	else
            		var photo = "";
              tempObj = {id: index+1, 
              			title: element.venue.name, 
              			location: {lat: element.venue.location.lat, lng: element.venue.location.lng}, 
              			photo: photo,
              			type: 'Monuments'};
              locations.push(tempObj);
             });
            initMap(called=true);
            $( "#wrongmsg" ).html("");
          },
          error: function(xhr, textStatus, errorThrown){
             $( "#wrongmsg" ).html("something went wrong..");
          }
        });
	}
}
