/**
 * Truck Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */

var TruckController = function(){
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
			$cache.page = jQuery('#page-truck');
			$cache.scanbtn = $cache.page.find('#btn-submit-scan');
		},
		
		/**
		 * Process the response from the API
		 * 
		 * @param {object} result
		 * @returns {void}
		 */
		processApi = function(result) {
			$.mobile.loader().hide();
			if (result) {
				if ('undefined' !== typeof result.code) {
					swal({
						'icon': 'error',
						'title': 'Truck Not Found',
						'timer': 2000,
						'buttons': false
					});
				} else {
					if (result.truck && result.truck.id) {
						window.currentTruck = result.truck;
						window.watchID = navigator.geolocation.watchPosition(window.GeoUpdate, window.GeoUpdateError, { timeout: 30000, enableHighAccuracy: true });
						App.Storage.setItem('last_truck', JSON.stringify(result.truck));
						swal({
							'icon': 'success',
							'title': 'Truck #' + result.truck.truck_number,
							'timer': 1000,
							'buttons': false
						}).then(function(){
							$.mobile.navigate('#page-checklist');
						});
					}
				}
			}
		},

		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			$cache.scanbtn.on('vclick', function(e){
				cordova.plugins.barcodeScanner.scan(
					function (result) {
						if ( ! result.cancelled) {
							$.mobile.loader().show();
							var id = result.text;
							Api.get(App.Settings.apiUrl + '/trucks/view/' + id + '.json', {}, processApi);
						}
					},
					function (error) {
						alert("Scanning failed: " + error);
					}
				);
			});
		},

		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function ($page) {
			$cache.scanbtn.off('vclick');
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
