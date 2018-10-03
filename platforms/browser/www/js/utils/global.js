/**
 * Global Functions
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 */

"use strict";

/**
 * Attempt to lock the screen orientation
 * 
 * @param {string} orientation
 * @returns {void}
 */
App.lockOrientation = function(orientation) {
	try {
		if ('undefined' !== typeof window.screen.lockOrientation)
			window.screen.lockOrientation(orientation);
		if ('undefined' !== typeof window.screen.orientation.lock)
			window.screen.orientation.lock(orientation);
	} catch (e) {}
};

/**
 * Unlock the screen orientation
 * 
 * @returns {void}
 */
App.unlockOrientation = function() {
	try {
		if ('undefined' !== typeof window.screen.orientation)
			window.screen.orientation.unlock();
		if ('undefined' !== typeof window.screen.unlockOrientation)
			window.screen.unlockOrientation();
	} catch (e) {}
};

/**
 * Print a document
 * 
 * @param {string} document Html to print
 * @param {string} name The name of the printed document
 * @returns {void}
 */
App.print = function(document, name) {
	if (window.printerId) {
		cordova.plugins.printer.print(document, { 
			printerId: window.printerId,
			graystyle: true,
			border: false,
			hidePageRange: true,
			hideNumberOfCopies: true,
			hidePaperFormat: true
		});
	} else {
		App.setupPrinter(App.print, document, name);
	}
};

/**
 * Attempt to connect to a printer
 * 
 * @param {function} callback Optional
 * @param {string} document
 * @param {string} name
 * @returns {void}
 */
App.setupPrinter = function(callback, document, name) {
	cordova.plugins.printer.check(function (available, count) {
		if (available) {
			var printCheck = function() {
				cordova.plugins.printer.pick(function (uri) {
					if (uri) {
						window.printerId = uri;
						callback(document, name);
					} else {
						window.printerId = false;
						navigator.notification.alert('Unable to find a printer. You must connect to the printer to continue.');
						setTimeout(printCheck, 3000);
					}
				});
			};

			App.setupPrinter();
		} else {
			navigator.notification.alert('This device does not support printing. You will not be able to print receipts.');
		}
	});
};