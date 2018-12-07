/**
 * Application Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */
var Application = function(){
	
	var
	
		/**
		 * Controller cache store
		 * 
		 * @type object
		 */
		Controllers = {},
		
		/**
		 * Controller stub used when no active controller is found
		 * 
		 * @type object
		 */
		conStub = {
			controller: '',
			trigger: function () {
				log('stubbed for '  + conStub.controller);
			}
		},
		
		/**
		 * This is where we figure out what page to show first
		 * 
		 * @returns void
		 */
		initialView = function () {
			console.log('initialView fired');
			window.location.hash = 'page-index';
			$.mobile.initializePage();
		},

		/**
		 * Helper function for console.log
		 * 
		 * @returns {undefined}
		 */
		log = function () {
			
		},

		/**
		 * Loads a controller
		 * 
		 * @param string controller
		 * @returns object|bool Returns the controller or false on fail
		 */
		loadController = function (controller) {
			if (typeof window[controller] !== 'function') {
				log('Error: Unable to find any controller named ' + controller);
				conStub.controller = controller;
				return conStub;
			}
			if (typeof Controllers[controller] === 'undefined') {
				Controllers[controller] = window[controller]();
				Controllers[controller].trigger('init');
			}

			return typeof Controllers[controller] === 'object' ? Controllers[controller] : false;
		},

		/**
		 * Returns the current active controller
		 * 
		 * @returns {Controllers|Application.Controllers|Boolean}
		 */
		activeController = function () {
			return $.mobile.activePage && $.mobile.activePage.data('controller')
					? loadController($.mobile.activePage.data('controller'))
					: conStub;
		},

		/**
		 * Returns the base controller
		 * 
		 * @returns {BaseController}
		 */
		baseController = function () {
			return loadController('BaseController');
		},

		/**
		 * Utility function to get the page id from it url.
		 * 
		 * @param string url
		 * @returns object
		 */
		getPage = function (url) {
			var u = $.mobile.path.parseUrl(url),
					page = u.hash || '#' + u.pathname.substring(1);
			return $(page).length ? $(page) : false;
		};

	return {
		
		/**
		 * Get a controller object by name instantiate or return the instance from cache
		 * 
		 * @param {string} controller
		 * @returns {Controllers|Application.Controllers|Application.conStub|Boolean}
		 */
		getController: function(controller) {
			return loadController(controller);
		},

		/**
		 * Event listener 
		 * 
		 * @argument object event
		 * @argument object ui
		 * @return object | false If the login fails
		 */
		onEvent: function (event, ui) {
			ui = typeof ui === 'undefined' ? {} : ui;
			// Handle the event
			console.log('event type: ' + event.type.toLowerCase());
			var activeController = loadController(
				$.mobile.pageContainer.pagecontainer("getActivePage").data('controller')
			);
			switch (event.type.toLowerCase()) {
				case 'mobileinit':
					//$.mobile.defaultPageTransition = 'pop';
					$.mobile.autoInitializePage = false;
					break;
				case 'pagecontainerbeforechange':
					// Prevent duplicate events
					if (typeof ui.toPage === 'string')
						return log('ui.toPage === string');
					
					var
						fromController,
						toController,
						from = typeof ui.prevPage === 'string' ? getPage(ui.prevPage) : typeof ui.prevPage === 'object' ? ui.prevPage : false,
						to = typeof ui.toPage === 'string' ? getPage(ui.toPage) : typeof ui.toPage === 'object' ? ui.toPage : false;
							
					if (to && to.data('auth') && ! window.authed) {
						window.authto = to.attr('id');
						$.mobile.changePage('#page-login', {
							changeHash: false
						});
						event.preventDefault();
						return false;
					}

					if (to && false !== (toController = loadController(to.data('controller')))) {
						console.log('trigger send on ' + to.data('controller'),toController);
						if (typeof toController['trigger'] === 'function') {
							toController.trigger('show', to);
						}
					}
					
					if (from && false !== (fromController = loadController(from.data('controller')))) {
						if (to && to.data('controller') && to.data('controller') === from.data('controller')) {
							return true;
						}
						console.log('trigger hide on ' + from.data('controller'),fromController);
						if (typeof fromController['trigger'] === 'function') {
							fromController.trigger('hide', from);
						}
					}
					break;
				case 'pagecontainershow':
					activeController.trigger('onshow');
					break;
				case 'loadcomplete':
					// Application has fully loaded.
					App.lockOrientation('portrait');
					setTimeout(function(){
						$('#splash').fadeOut(300, function () {
							$(window).orientationchange();
							$(this).remove();
							StatusBar.show();
							StatusBar.styleDefault();
							StatusBar.backgroundColorByHexString("#FFFFFF");
							$(document.body).removeClass('loading');
							$.mobile.defaultPageTransition = 'slide';
						});
					}, 3000);
					window.user = {};
					window.authto = '';
					window.authed = false;
					if (App.Storage.getItem('user-saved')) {
						window.user = JSON.parse(App.Storage.getItem('Auth'));
					}
					initialView();
					Api.loadSettings();
					break;
				case 'orientationchange':
					baseController().trigger(event.type.toLowerCase(), event.orientation);
					break;
				case 'online':
				case 'offline':
				case 'pause':
				case 'resume':
				default:
					var ac = activeController;
					if (ac) ac.trigger(event.type.toLowerCase(), ui);
					baseController().trigger(event.type.toLowerCase(), ui);
			}
		}
	};
};
