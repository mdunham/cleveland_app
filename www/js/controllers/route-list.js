/**
 * Index Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */

var RouteListController = function(){
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
		initialize = function() {
			$cache.page = jQuery('#page-route-list');
			$cache.start_route = $cache.page.find('#btn-submit-route');
		},

		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function($page) {
			$cache.start_route.on('vclick', function(){
				if (window.printerId) {
					cordova.plugins.printer.print('<h1>Cleveland Petrol App</h1><hr /><p>Line item one</p><p>Line item one</p><p>Line item one</p><p>Line item one</p><p>Line item one</p><p>Line item one</p><hr/><strong>Footer</strong>', { printerId: window.printerId });
				}
			});
		},

		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function($page) {
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
				case 'hide':
					onBeforeHide($page);
					break;
			}

		}

	};
};
