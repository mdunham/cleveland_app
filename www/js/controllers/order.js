/**
 * Order Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */

var OrderController = function () {
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
			$cache.page = jQuery('#page-order');
			$cache.title = $cache.page.find('h1.title');
			$cache.orderTable = $cache.page.find('.o-table');
			$cache.orderTableHeaders = $cache.page.find('.t-headers');
			$cache.orderTableValues = $cache.page.find('.t-values');
			$cache.dirSlideToggle = $cache.page.find('a.toggle-slide');
			$cache.startFuel = $cache.page.find('#start_fuel_btn');
			$cache.addNote = $cache.page.find('#add_note_btn');
			$cache.payNow = $cache.page.find('#pay_now_btn');
			$cache.addItem = $cache.page.find('#add-item');
			$cache.route;
		},
			
		/**
		 * Pay for order show payment options
		 * 
		 * @returns {void}
		 */
		payNow = function() {
			window.routeIndex++;
			$.mobile.navigate('#page-route');
		},
		
		/**
		 * Add/Edit a note to this order
		 * 
		 * @returns {void}
		 */
		addNote = function() {
			
		},
		
		/**
		 * Tell the meter to being pumping fuel
		 * 
		 * @returns {void}
		 */
		startFuel = function() {
			
		},
		
		/**
		 * Add an item to the order
		 * 
		 * @returns {void}
		 */
		addItem = function() {
			
		},
		
		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			$cache.route = window.routeStops[window.routeIndex];
			$cache.payNow.on('vclick', payNow);
			$cache.addNote.on('vclick', addNote);
			$cache.startFuel.on('vclick', startFuel);
			$cache.addItem.on('vclick', addItem);
			if ($cache.route && $cache.route.type === 'delivery') {
				$cache.title.text('Order #' + $cache.route.record.order.id);
			} else {
				$cache.title.text('Refill Tank');
			}
		},
		
		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function ($page) {
			$cache.payNow.off('vclick');
			$cache.addNote.off('vclick');
			$cache.startFuel.off('vclick');
			$cache.addItem.off('vclick');
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
