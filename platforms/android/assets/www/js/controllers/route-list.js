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
			
		/**
		 * This is called when the controller is first used
		 * 
		 * @argument object $page jQuery object
		 * @returns void
		 */
		initialize = function () {
			$cache.page = jQuery('#page-route-list');
			$cache.stopList = $cache.page.find('div.stop_list_box');
			$cache.countStops = $cache.page.find('.count-stops');
			$cache.countMiles = $cache.page.find('.count-miles');
			$cache.countGals = $cache.page.find('.count-gallons');
			$cache.editBtn = $cache.page.find('#edit-route');
			$cache.optimizeRoute = $cache.page.find('#btn-submit-optimize');
			$cache.list = false;
			$cache.start_route = $cache.page.find('#btn-submit-route');
		},
		
		/**
		 * Handle the resposne from the API
		 * 
		 * @param {object} response
		 * @returns {void}
		 */
		setRoute = function (response) {
			$.mobile.loader().hide();
			
			if ( ! response || ! response.routes) {
				navigator.notification.alert('There are no orders for you to deliver.');
				$cache.countGals.text('0');
				$cache.countStops.text('0');
				$cache.countMiles.text('0');
				return;
			}
			
			var 
				routes = response.routes.route,
				response = response.routes.directions,
				bounds = new google.maps.LatLngBounds(response.routes[0].bounds.southwest, response.routes[0].bounds.northeast),
				distance = 0, duration = 0, noStops = 0, totalFuel = 0;
			
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
			
			response.routes[0].legs.map(function(leg){
				distance = distance + leg.distance.value;
				duration = duration + leg.duration.value;
			});
			
			noStops = response.routes[0].legs.length;
			
			response.request = { travelMode: google.maps.TravelMode.DRIVING };
			
			window.routeStops = routes;
			window.routeIndex = 0;
			window.routeDirections = response;
			window.routeOrder = [];
			window.refreshRoute = false;

			var tpl = '<ul class="stop_list" data-role="listview">';
			routes.map(function (location) {
				if (location.type === 'delivery') {
					totalFuel = totalFuel + location.record.order.amount_deliver;
					var 
						customerName = location.record.order.customer.name,
						orderDeliver = location.record.order.amount_deliver,
						orderNumber  = location.record.order.id,
						orderTotal   = location.record.order.grand_total;
					orderDeliver = numberFormat(orderDeliver);
					orderTotal = '$' + numberFormat(orderTotal);
					tpl = tpl + `<li data-id="${location.id}"><span class="move_hand"><i class="fas fa-bars"></i></span><strong class="customer-name">${customerName}</strong><span class="order_no">#${orderNumber}</span><span class="deliver_amount">${orderDeliver} gals.</span><span class="order_total">${orderTotal}</span></li>`;
				} else {
					tpl = tpl + `<li data-id="${location.id}"><span class="move_hand"><i class="fas fa-bars"></i></span><strong class="customer-name">Truck Refueling Stop</strong><span class="tank_name">${location.tank.name}</span><span class="deliver_amount">${location.refill} gals.</span></li>`;
				}
				window.routeOrder.push(location.id);
			});
			tpl = tpl + '</ul>';
			
			$cache.countGals.text(numberFormat(totalFuel));
			$cache.countStops.text(numberFormat(noStops));
			$cache.countMiles.text(numberFormat(Math.ceil(toMiles(distance))));
			
			$cache.stopList.html('').removeClass('editing');
			$cache.stopList.html(tpl);
			$cache.page.find('ul.stop_list').listview();
		},
		
		/**
		 * Save and start the route
		 * 
		 * @returns {void}
		 */
		startRoute = function (){
			if ($cache.stopList.hasClass('editing')) {
				$cache.editBtn.click();
				setTimeout(startRoute, 750);
				return false;
			} else {
				$.mobile.navigate('#page-route');
			}
		},
		
		/**
		 * Edit the route
		 * 
		 * @returns {void}
		 */
		editRoute = function() {
			if ($cache.stopList.hasClass('editing')) {
				$cache.editBtn.text('Edit');
				$cache.stopList.removeClass('editing');
				$cache.stopList.find('.stop_list').sortable('destroy');
				window.routeOrder = [];
				$cache.stopList.find('.stop_list li').each(function(){
					window.routeOrder.push($(this).data('id'));
				});
			} else {
				$cache.editBtn.text('Save Route');
				$cache.stopList.addClass('editing');
				$cache.stopList.find('.stop_list').sortable({
					handle: ".move_hand"
				});
				$cache.stopList.find('.stop_list').disableSelection();
				$cache.stopList.find('.stop_list').on('sortstop', function(event, ui) {
					$cache.stopList.find('.stop_list').listview('refresh');
					window.routeOrder = [];
					$cache.page.find('li[data-id]').each(function(){
						window.routeOrder.push($(this).data('id'));
					});
				});
			}
		},
				
		/**
		 * Force refresh from server
		 * 
		 * @returns {void}
		 */
		refreshRoute = function() {
			setTimeout(function () {
				$.mobile.loader().show();
				Api.post(App.Settings.apiUrl + '/routes/driver/' + window.currentUser.id + '/' + window.currentTruck.id + '.json', {
					latitude: window.lastCoord.latitude,
					longitude: window.lastCoord.longitude
				}, setRoute);
			}, 30);
		},

		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			if (window.refreshRoute) {
				refreshRoute();
			}
			
			$cache.optimizeRoute.on('vclick', function(e){
				window.refreshRoute = true;
				refreshRoute();
			});
			$cache.start_route.on('vclick', startRoute);
			$cache.editBtn.on('vclick', editRoute);
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
			$cache.editBtn.off('vclick');
			$cache.optimizeRoute.off('vclick');
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
