 /**
 * My GRC Appication Delegate
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @argument object $document Cached jQuery Document Object
 * @argument object $window Cached jQuery Document Object
 */

"use strict";

(function(Controller){
	var
		
		/**
		 * Application Constructor - The device is ready 
		 * 
		 * @returns void
		 */
		EventHandler = function(event, ui){
			if (typeof event !== 'undefined') {
				// Notify the Application Controller
				Controller.onEvent(event, ui);
			}
		},
		
		/**
		 * Initialize Push Notifications
		 * 
		 * @returns {undefined}
		 */
		setupPush = function() {
            if (typeof FCMPlugin === 'undefined') return;
			
			FCMPlugin.getToken(function(token){
				window.pushToken = token;
			});
			
			FCMPlugin.onTokenRefresh(function(token){
				window.pushToken = token;
				if (window.currentUser && window.currentUser.id) {
					Api.post(App.Settings.apiUrl + '/push-tokens/add.json', {
						user_id: window.currentUser.id,
						token: token
					}, function(response){});
				}
			});
			
			FCMPlugin.onNotification(function(data){
				if(data.wasTapped){
				  //Notification was received on device tray and tapped by the user.
				  alert( JSON.stringify(data) );
				}else{
				  //Notification was received in foreground. Maybe the user needs to be notified.
				  alert( JSON.stringify(data) );
				}
			});
		},
		
		/**
		 * Setup the event listeners
		 * 
		 * @returns void
		 */
		init = function(){
			var 
				deviceReadyDeferred = $.Deferred(),
				jqmReadyDeferred = $.Deferred(),
				onLoad = function(event){
					if (event.type === 'deviceready') {
						deviceReadyDeferred.resolve();
						setupPush();
						$(document).on('pagecontainershow', EventHandler);
						$(document).on('beforeshow', EventHandler);
						$(document).on('pagecontainerbeforechange', EventHandler);
						$(document).delegate('div[data-rel="page"]', 'pagebeforeshow', EventHandler);
						$(window).on('orientationchange', EventHandler);
					} else if (event.type === 'mobileinit') {
						jqmReadyDeferred.resolve();
					}
					EventHandler(event);
				}; 

			// jQuery Mobile Init
			$(document).one('mobileinit', onLoad);
			
			// Make the header return home
			$(document).on('click', 'h1.ui-title', function(e){
				e.preventDefault();
				$.mobile.navigate('#page-index');
			});
			
			// Setup cordova event listeners
			document.addEventListener('deviceready', onLoad, false);
			document.addEventListener('pause', EventHandler, false);
			document.addEventListener('resume', EventHandler, false);
			document.addEventListener('online', EventHandler, false);
			document.addEventListener('offline', EventHandler, false);

			// When both the device and jquery are ready trigger loadcomplete
			$.when(deviceReadyDeferred, jqmReadyDeferred).then(function(){
				EventHandler(new Event('loadcomplete'));
			});
		};
    
	window._app = Controller;
	
	// Initalize the application
	init();
	
})(new Application());