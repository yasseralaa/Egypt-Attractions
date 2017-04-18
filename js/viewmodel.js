      //ViewModel
      var map;
      
      // All Markers and infowindows.
      var markers = [];
      var InfoWindows = [];

      //if first time calling, just init the map
      //if it's called after getting data get started
      function initMap(called=false) {
        if(!called)
        {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 30.044021, lng: 31.234852},
          zoom: 13,
          mapTypeControl: false
        });
        }
        else
        {
        // These are the real estate listings that will be shown to the user.
        // Normally we'd have these in a database instead.
        
        var largeInfowindow = new google.maps.InfoWindow();

        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('0091ff');
        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('FFFF24');
        

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var index = locations[i].id;
          var position = locations[i].location;
          var title = locations[i].title;
          var type = locations[i].type;
          var photo = locations[i].photo;
          // Create a marker per location, and put into markers array.
           var marker = new google.maps.Marker({
            position: position,
            title: title,
            type: type,
            photo: photo,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          
          marker.setIcon(defaultIcon);
          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });

          // Create an onclick event to BOUNCE each marker.
          marker.addListener('click', function() {
            toggleBounce(this);
          });
        }
        var ViewModel = function() {
            //-------------------filter menu------------
            this.allfilters = ko.observableArray(["All Places", "Museums", "Shopping Mall", "Monuments"]);
            this.selectedFilter = ko.observable("All Places");
            this.places = ko.observableArray(); //initial places here
            var bounds = new google.maps.LatLngBounds();
            // Extend the boundaries of the map for each marker and display the marker
              for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
                this.places.push({id: markers[i].id,title: markers[i].title});
              }
              map.fitBounds(bounds);
            //------------------------------------------

            //to place element from list view
            this.placeIndex = ko.observable(0);
            this.placeElement = function(index) {
                closeMarkers();
                toggleBounce(markers[index]);
                populateInfoWindow(markers[index], new google.maps.InfoWindow());
            }
            //to filter places based on type
            this.filterPlaces = function(data, event) {
              closeMarkers();
              this.places.removeAll();
              var bounds = new google.maps.LatLngBounds();
              // Extend the boundaries of the map for each marker and display the marker
              for (var i = 0; i < markers.length; i++) {
                if(this.selectedFilter() == markers[i].type || this.selectedFilter()=="All Places")
                {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
                this.places.push({id: markers[i].id,title: markers[i].title});
                }
                else
                markers[i].setMap(null);
              }
              map.fitBounds(bounds);
            }
        };
        ko.applyBindings(new ViewModel());
        //making toggleBounce on markers
        function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 1500);
        }
      }
      // This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
      //getting sure all infowindows closed before open another
      function closeMarkers()
      {
        for (var i = 0; i < InfoWindows.length; i++)
        {
          InfoWindows[i].close();
        }
        InfoWindows = [];
      }

          // This function populates the infowindow when the marker is clicked. We'll only allow
          // one infowindow which will open at the marker that is clicked, and populate based
          // on that markers position.
          function populateInfoWindow(marker, infowindow) {
            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
              // Clear the infowindow content to give the streetview time to load.
              infowindow.setContent('');
              infowindow.marker = marker;
              // Make sure the marker property is cleared if the infowindow is closed.
              infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
              });
              var streetViewService = new google.maps.StreetViewService();
              var radius = 50;
              // In case the status is OK, which means the pano was found, compute the
              // position of the streetview image, then calculate the heading, then get a
              // panorama from that and set the options
              strForInfo = '<div>' + marker.title + '</div><div><img src="'+marker.photo+'" alt="Place Image" height="200" width="400"></div>'
              
              function getStreetView(data, status) {
                  var heading = google.maps.geometry.spherical.computeHeading(
                    null, marker.position);
              }
              infowindow.setContent(strForInfo);
              // Use streetview service to get the closest streetview image within
              // 50 meters of the markers position
              streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
              // Open the infowindow on the correct marker.
              closeMarkers();
              infowindow.open(map, marker);
              InfoWindows.push(infowindow);
            }
          }

        }
      }
      
      