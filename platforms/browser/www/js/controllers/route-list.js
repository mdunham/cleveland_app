/**
 * Index Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */

var RouteListController = function () {
	var
		/**
		 * Object cache for the index page
		 * 
		 * @type type
		 */
		$cache = {},
		decodeLine = function (encoded) {
			var len = encoded.length;
			var index = 0;
			var array = [];
			var lat = 0;
			var lng = 0;

			while (index < len) {
				var b;
				var shift = 0;
				var result = 0;
				do {
					b = encoded.charCodeAt(index++) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
				lat += dlat;

				shift = 0;
				result = 0;
				do {
					b = encoded.charCodeAt(index++) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
				lng += dlng;

				array.push(new google.maps.LatLng(lat * 1e-5, lng * 1e-5));
			}

			return array;
		},
		/**
		 * This is called when the controller is first used
		 * 
		 * @argument object $page jQuery object
		 * @returns void
		 */
		initialize = function () {
			$cache.page = jQuery('#page-route-list');
			$cache.directions = $cache.page.find('#directions');
			$cache.map = $cache.page.find('#map');
			$cache.list = false;
			$cache.directionsDisplay = new google.maps.DirectionsRenderer({
				markerOptions: {
					visible: true
				},
				polylineOptions: {
					strokeColor: '#0088FF',
					strokeWeight: 6,
					strokeOpacity: 0.6
				}
			});
			$cache.mapObj = new google.maps.Map($cache.map[0], {
				zoom: 7,
				center: {
					lat: window.lastCoord.latitude,
					lng: window.lastCoord.longitude
				}
			});
			$cache.start_route = $cache.page.find('#btn-submit-route');
		},
		setRoute = function (response) {
			$.mobile.loader().hide();
			console.log(response);
			var 
				routes = response.routes.route,
				response = response.routes.directions,
				bounds = new google.maps.LatLngBounds(response.routes[0].bounds.southwest, response.routes[0].bounds.northeast);
			response.routes[0].bounds = bounds;

			response.routes[0].overview_path = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline.points);

			response.routes[0].legs = response.routes[0].legs.map(function (leg) {
				leg.start_location = new google.maps.LatLng(leg.start_location.lat, leg.start_location.lng);
				leg.end_location = new google.maps.LatLng(leg.end_location.lat, leg.end_location.lng);
				leg.steps = leg.steps.map(function (step) {
					step.path = google.maps.geometry.encoding.decodePath(step.polyline.points);
					step.start_location = new google.maps.LatLng(step.start_location.lat, step.start_location.lng);
					step.end_location = new google.maps.LatLng(step.end_location.lat, step.end_location.lng);
					return step;
				});
				return leg;
			});
			
			response.request = { travelMode: google.maps.TravelMode.DRIVING };

			$cache.directionsDisplay.setDirections(response);

			if ($cache.list) {
				$cache.list.remove();
			}
			var tpl = '<ul data-role="listview">';
			routes.map(function (location) {
				tpl = tpl + '<li>Stop Type: ' + location.type + '</li>';
			});
			tpl = tpl + '</ul>';

			$cache.directions.after(tpl);
		},
		startRoute = function () {
			
		},
//		calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
//		 if (document.getElementById('start').value === 'current') {
//				navigator.geolocation.getCurrentPosition(function (position) {
//					var end = document.getElementById('end').value.split(',');
//					directionsService.route({
//						origin: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
//						destination: new google.maps.LatLng(end[1], end[0]),
//						travelMode: 'DRIVING'
//					}, function (response, status) {
//						if (status === 'OK') {
//							
//						} else {
//							window.alert('Directions request failed due to ' + status);
//						}
//					});
//				}, function () {
//					alert('error')
//				});
//			} else {
//				var start = document.getElementById('start').value.split(',');
//				var end = document.getElementById('end').value.split(',');
//				directionsService.route({
//					origin: new google.maps.LatLng(start[1], start[0]),
//					destination: new google.maps.LatLng(end[1], end[0]),
//					travelMode: 'DRIVING'
//				}, function (response, status) {
//					if (status === 'OK') {
//						directionsDisplay.setDirections(response);
//					} else {
//						window.alert('Directions request failed due to ' + status);
//					}
//				});
//			}
//		},
//		
		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			setTimeout(function () {
				$.mobile.loader().show();
			}, 30);


			$cache.directionsDisplay.setMap($cache.mapObj);
			$cache.directionsDisplay.setPanel($cache.directions[0]);

			Api.post(App.Settings.apiUrl + '/routes/driver/' + window.currentUser.id + '/' + window.currentTruck.id + '.json', {
				latitude: window.lastCoord.latitude,
				longitude: window.lastCoord.longitude
			}, setRoute);

			$cache.start_route.on('vclick', startRoute);
		},
		onShow = function () {

		},
		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function ($page) {
			$cache.start_route.off('vclick');
		};


	return {

		/**
		 * This is where we track events 
		 * 
		 * @argument string event
		 * @argument object $page jQuery object of the source page
		 * @return void
		 */
		trigger: function (event, $page) {
			switch (event) {
				case 'init':
					initialize();
					break;
				case 'show':
					onBeforeShow($page);
					break;
				case 'onshow':
					onShow($page);
					break;
				case 'hide':
					onBeforeHide($page);
					break;
			}

		}

	};
};
