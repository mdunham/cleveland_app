/**
 * Route Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */

var RouteController = function () {
	var
	
		/**
		 * Object cache for the index page
		 * 
		 * @type type
		 */
		$cache = {},
			
		/**
		 * This is called when the controller is first used
		 * 
		 * @argument object $page jQuery object
		 * @returns void
		 */
		initialize = function () {
			$cache.page = jQuery('#page-route');
			$cache.map = $cache.page.find('#map');
			$cache.dirSlide = $cache.page.find('#dir-slide');
			$cache.dirSlideToggle = $cache.page.find('a.toggle-slide');
			$cache.directions = $cache.page.find('#directions');
			$cache.arrviedBtn = $cache.page.find('#btn-submit-arrived');

			$cache.editBtn = $cache.page.find('#edit-route');
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
			$cache.dirService = new google.maps.DirectionsService;
			$cache.mapObj = new google.maps.Map($cache.map[0], {
				zoom: 7,
				center: {
					lat: window.lastCoord.latitude,
					lng: window.lastCoord.longitude
				}
			});
		},
		
		/**
		 * Open the directions slider
		 * 
		 * @returns {void}
		 */
		toggleSlider = function() {
			$cache.dirSlide.toggleClass('open');
		},
		
		/**
		 * We have arrived open the order screen
		 * 
		 * @returns {void}
		 */
		setArrived = function() {
			$.mobile.navigate('#page-order');
		},
		
		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			$cache.directionsDisplay.setMap($cache.mapObj);
			$cache.directionsDisplay.setPanel($cache.directions[0]);
			
			$cache.dirService.route({
				origin: new google.maps.LatLng(window.lastCoord.latitude, window.lastCoord.longitude),
				destination: new google.maps.LatLng(window.routeStops[window.routeIndex].lat, window.routeStops[window.routeIndex].lon),
				travelMode: 'DRIVING'
			}, function(response, status) {
				if (status === 'OK') {
					$cache.directionsDisplay.setDirections(response);
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});

			$cache.dirSlideToggle.on('vclick', toggleSlider);
			$cache.arrviedBtn.on('vclick', setArrived);
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
			$cache.dirSlideToggle.off('vclick');
			$cache.arrviedBtn.off('vclick');
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
				case 'hide':
					onBeforeHide($page);
					break;
			}

		}

	};
};
