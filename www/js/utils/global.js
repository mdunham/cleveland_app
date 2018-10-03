/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App.lockOrientation = function(orientation) {
	try {
		if ('undefined' !== typeof window.screen.lockOrientation)
			window.screen.lockOrientation(orientation);
		if ('undefined' !== typeof window.screen.orientation.lock)
			window.screen.orientation.lock(orientation);
	} catch (e) {}
};

App.unlockOrientation = function() {
	try {
		if ('undefined' !== typeof window.screen.orientation)
			window.screen.orientation.unlock();
		if ('undefined' !== typeof window.screen.unlockOrientation)
			window.screen.unlockOrientation();
	} catch (e) {}
};