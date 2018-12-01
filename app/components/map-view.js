import Component from '@ember/component';

export default Component.extend({
	map: null,
	markers: [],
	service: null,
	
	didInsertElement(){
		this._super(...arguments);
		this.createMap();
		this.service = new google.maps.places.PlacesService(this.map);
	},

	createMap(){
		let container = this.element.querySelector('#map-container');
		let options = {
			center: {lat: 26.8, lng: 30.8}, 
			zoom: 3,
			gestureHandling: 'cooperative',
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.BOTTOM_CENTER
			},
			zoomControl: false,
          	
          	fullscreenControl: false,
          	streetViewControl: false,
         	

		};
		this.map = new google.maps.Map(container, options);
		this.setUpAutocomplete();
	},



	setUpAutocomplete(){
		
		var input = this.element.querySelector('#input-search');
		var searchBox = new google.maps.places.SearchBox(input);

		// Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        searchBox.bindTo('bounds', this.map);
		
		searchBox.addListener('places_changed', () => {
			this.clearOutMarkers();
			var places = searchBox.getPlaces();
			if (places.length == 0) {
				return;
			}

			
			var bounds = new google.maps.LatLngBounds();
			// place is a specific place
			places.forEach((place) => {
				if (place['types'][0] != "country" && place['types'][0] == "locality"){
					this.fillCityDetails(place.name);
				} else {
					this.getTopCities(place.name);
				}
				if (place.geometry.viewport) {
			      // Only geocodes have viewport.
			      bounds.union(place.geometry.viewport);
			    } else {
			      bounds.extend(place.geometry.location);
			    }
			});
			this.map.fitBounds(bounds);
			

		});
	},


	clearOutMarkers(){
		this.markers.forEach(function(marker) {
			marker.setMap(null);
		});
		this.markers = [];
	},

	createPlaceMarker(name, loc){
		var marker = new google.maps.Marker({
			map: this.map,
			title: name,
			position: loc,
			animation: google.maps.Animation.DROP
		});
		this.markers.push(marker);
		var contentString = "<div class='container'>"+
				  				"<div class='row'>"+
				  					"<h5>" + name + "</h5>" + 
				  				"</div> "+ 
				  			"</div>" ;
		var infoWindow = new google.maps.InfoWindow({
			content: '',
		});
		
		this.bindInfoWindow(marker,infoWindow, contentString, name);
	}, 

	createPOIMarkers(place){
		var icon = {
			url: place.icon,
			size: new google.maps.Size(70, 70),
			origin: new google.maps.Point(0, 0),
			ahcnor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(35, 35)
		}

		var marker = new google.maps.Marker({
			map: this.map,
			icon: icon,
			title: place.name,
			position: place.geometry.location,
			animation: google.maps.Animation.DROP
		});
		this.markers.push(marker);
		// create infowindow
		var infowindow = new google.maps.InfoWindow({
			content: ''
		});

		// image for POI
		var url = ""; 
		if (place.photos != null){
			url = place.photos['0'].getUrl({
		        maxWidth: 200,
		        maxHeight: 200
		    });
		}
		 
		var contentString = 
  			"<div class='container'>"+
  				"<div class='row'>"+
  					"<h4>" + place.name + "</h4>" + 
  				"</div> "+ 
  				"<div class='row'>"+
  					"<img src='" + url + "' alt='Image unavailable'>" 
  				"</div> "+
  			"</div>" ;
  		this.bindInfoWindow(marker, infowindow, contentString, place.name);
	},

	bindInfoWindow(marker,infowindow, html, loc, city) { 
		google.maps.event.addListener(marker, 'mouseover', function() { 
			infowindow.setContent(html); 
			infowindow.open(this.map, marker); 
		}); 
		google.maps.event.addListener(marker, 'mouseout', function() { 
			
			infowindow.close();
		}); 
		google.maps.event.addListener(marker, 'click', function() { 
			if (atStepOne()){
				addToChosen(loc)
			}
			else if (atStepTwo()){
				addAttraction(city, loc);
			}
		}); 
	},

	getTopCities(country){
		var geocoder = new google.maps.Geocoder();
		// geocode the country to show popular cities 
		geocoder.geocode({'address': country}, (results, status) => {
			if (status == 'OK'){
				results = results['0'];
				
				var urlGeo = "http://api.geonames.org/searchJSON?country=" + results['address_components'][0]['short_name'] + "&cities=cities15000&orderby=population&featureClass=P&username=yuanx";

				// use GEONAMES api to get popular cities
				let promise = $.ajax({
					type: 'GET',
					url: urlGeo
				});
				promise.then((results, status) => {
					if (status == "success"){
						console.log(results);
						var geonames = results['geonames'];
						// create infowindow to use 
						var infowindow = new google.maps.InfoWindow({
          						content: ''
       			 		});
						for (var i = 0; i < Math.min(geonames.length, 10); i++){
							var city = geonames[i]['toponymName'];
							var myLatlng = new google.maps.LatLng(geonames[i]['lat'],geonames[i]['lng']);
							this.createPlaceMarker(city, myLatlng);
							
						}

					} else {
						console.log("error: " + status);
					}
				})
			} else {
				console.log('Geocode not successful: ' + status); 
			}
		})
	},
	
	fillCityDetails(loc){
		this.service.textSearch({query: loc + ' points of interest'}, (data, status) => {
			if (status == 'OK'){
				var bounds = new google.maps.LatLngBounds();
				data.forEach((place) => {
					this.createPOIMarkers(place);
				});
			} else {
				console.log("error: " + status);
			}
		});
	}
	

	

	
});
