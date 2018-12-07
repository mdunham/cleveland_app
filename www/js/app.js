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
			
			FCMPlugin.subscribeToTopic('drivers');
			
			FCMPlugin.onNotification(function(data){
				window.refreshRoute = true;
				if (data.wasTapped) {
					$.mobile.navigate('#page-route-list');
				} else {
					navigator.notification.confirm('New order received view it now?', function(e){
						if (e === 1) {
							$.mobile.navigate('#page-route-list');
						}
					}, 'New Order', ['Goto Route List','Cancel']);
				}
			});
		},
		
		/**
		 * This setups the background mode plugin that activate when the app is open and not active 
		 * 
		 * @returns {void}
		 */
		setupBackgroundMode = function() {
			window.bgText = 'Still running in background';
			
			cordova.plugins.backgroundMode.setDefaults({
				title: 'Petrol Hub',
				text: window.bgText,
				color: 'F14F4D'
			});

			cordova.plugins.backgroundMode.enable();

			cordova.plugins.backgroundMode.on('activate', function() {
				try { cordova.plugins.backgroundMode.disableWebViewOptimizations(); } catch (e) {}
				try { navigator.geolocation.clearWatch(window.watchID); clearInterval(window.watchID); } catch (e) {}
				
				window.watchID = setInterval(() => {
					try {
						 navigator.geolocation.getCurrentPosition(window.GeoUpdate, () => console.log('GPS Background Mode - Failed to get position.'), { timeout: 30000});
					} catch (e) {}
					
					cordova.plugins.backgroundMode.configure({
						text: window.bgText
					});
				}, 120000);
			});

			cordova.plugins.backgroundMode.on('deactivate', function() {
				try {
					clearInterval(window.watchID);
					window.GeoUpdateError();
					cordova.plugins.notification.badge.clear();
				} catch (e) {}
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
						setupBackgroundMode();
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
 
            window.addEventListener('load', function () {
				setTimeout(function(){
					$.vmouse.resetTimerDuration = 50;
					FastClick.attach(document.body);
					//$(document).on('click', 'input, textarea',function(){ var $this = $(this); setTimeout(function(){if ( ! $this.is(":focus")) $this.focus(); }, 100); });
				}, 100);
            }, false);
			
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
