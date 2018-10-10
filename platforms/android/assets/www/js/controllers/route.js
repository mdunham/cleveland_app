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
			$cache.lockBtn = $cache.page.find('a.lock_map');
			$cache.dirSlideToggle = $cache.page.find('a.toggle-slide');
			$cache.directions = $cache.page.find('#directions');
			$cache.arrviedBtn = $cache.page.find('#btn-submit-arrived');
			$cache.timer = false;
			$cache.curRoute = false;
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
				zoom: 15,
				center: {
					lat: window.lastCoord.latitude,
					lng: window.lastCoord.longitude
				},
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google.maps.ControlPosition.TOP_CENTER
				},
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				scaleControl: true,
				streetViewControl: false,
				fullscreenControl: true
			});
			
			if ( ! window.watchID) {
				window.GeoUpdateError();
			}
			
			$cache.marker = new google.maps.Marker({
				position: {lat: window.lastCoord.latitude, lng: window.lastCoord.longitude},
				map: $cache.mapObj,
				title: 'Current Location'
			});
			
		},
		
		/**
		 * Open the directions slider
		 * 
		 * @returns {void}
		 */
		toggleSlider = function() {
			$cache.dirSlide.toggleClass('open');
			if ($cache.dirSlide.hasClass('open')) {
				$cache.map.css('height', '65%');
			} else {
				$cache.map.css('height', '91%');
			}
		},
		
		/**
		 * We have arrived open the order screen
		 * 
		 * @returns {void}
		 */
		setArrived = function() {
			Api.post(App.Settings.apiUrl + '/routes/arrived/' + $cache.curRoute.id + '.json', {
				user_id: window.currentUser.id,
				truck_id: window.currentTruck.id
			}, function(res){
				console.log(res);
			});
			$.mobile.navigate('#page-order');
		},
				
		/**
		 * Update the map position
		 * 
		 * @returns {void}
		 */
		updateMap = function(){
			var curPos = new google.maps.LatLng(window.lastCoord.latitude, window.lastCoord.longitude);
			$cache.ticks++;
			if ($cache.ticks > 4) {
				$cache.ticks = 0;
				$cache.dirService.route({
					origin: curPos,
					destination: new google.maps.LatLng($cache.curRoute.lat, $cache.curRoute.lon),
					travelMode: 'DRIVING'
				}, function(response, status) {
					if (status === 'OK') {
						$cache.directionsDisplay.setDirections(response);
					} else {
						window.alert('Directions request failed due to ' + status);
					}
				});
			}

			setTimeout(function(){
				$cache.mapObj.panTo(curPos);
				$cache.marker.setPosition(curPos);
				$cache.mapObj.setZoom(16);
			}, 100);
		},
		
		
		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			var 
				routeId = window.routeOrder[window.routeIndex],
				curRoute = window.routeStops.filter(function(route){
					return route.id === routeId;
				});
				
			if ( ! curRoute.length) {
				navigator.notification.alert('Invalid Route!');
				$.mobile.navigate('#page-route-list');
				return;
			}
			
			$cache.curRoute = curRoute[0];			
			
			$cache.directionsDisplay.setMap($cache.mapObj);
			$cache.directionsDisplay.setPanel($cache.directions[0]);
			
			$cache.dirService.route({
				origin: new google.maps.LatLng(window.lastCoord.latitude, window.lastCoord.longitude),
				destination: new google.maps.LatLng($cache.curRoute.lat, $cache.curRoute.lon),
				travelMode: 'DRIVING'
			}, function(response, status) {
				if (status === 'OK') {
					$cache.directionsDisplay.setDirections(response);
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
			
			if ($cache.timer) {
				clearInterval($cache.timer);
			}
			
			$cache.ticks = 0;
			
			$cache.lockBtn.on('vclick', function(e){
				e.preventDefault();
				if ($(this).hasClass('on')) {
					clearInterval($cache.timer);
					$(this).removeClass('on');
				} else {
					$(this).addClass('on');
					if ($cache.timer) {
						clearInterval($cache.timer);
					}

					$cache.ticks = 0;
					$cache.timer = setInterval(updateMap, 2500);
					updateMap();
				}
			});
			
			$cache.timer = setInterval(updateMap, 2500);

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
			clearInterval($cache.timer);
			$cache.timer = false;
			$cache.lockBtn.off('vclick');
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
