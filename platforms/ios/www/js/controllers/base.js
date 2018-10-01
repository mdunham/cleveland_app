/**
 * Base Controller 
 * 
 * This is the base controller that is called after any active page controller
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */
var BaseController = function(){
	var

		/**
		 * This is called when the controller is first used
		 * 
		 * @argument object $page jQuery object
		 * @returns void
		 */
		initialize = function () {
			// Base Initialization
		},

		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			// Called before any page is shown
		},
				
		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onPause = function ($page) {
			// Called before any page is shown
		},
				
		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onResume = function ($page) {
			// Called before any page is shown
		},
				
		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onOrientationChanged = function (event, orientation) {
			$(document.body)
				.removeClass('landscape-mode portrait-mode')
				.addClass(orientation+'-mode');
		},
		
		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function ($page) {
			// Called before any page is hidden
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
				case 'resume':
					onResume($page);
					break;
				case 'pause':
					onPause($page);
					break;
				case 'orientationchange':
					onOrientationChanged(event, $page);
					break;
			}

		}

	};
};
