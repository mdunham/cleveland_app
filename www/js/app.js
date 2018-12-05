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
				console.log(data);
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
						cordova.plugins.backgroundMode.setDefaults({
							title: 'Petrol Hub',
							text: 'Connected to the office',
							icon: 'icon',
							color: 'F14F4D',
							resume: true,
							hidden: false,
							bigText: true
						});
						cordova.plugins.backgroundMode.enable();
						cordova.plugins.backgroundMode.on('activate', function() {
							try {
								cordova.plugins.backgroundMode.disableWebViewOptimizations();
								window.GeoUpdateError();
							} catch (e) {}
						});
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
