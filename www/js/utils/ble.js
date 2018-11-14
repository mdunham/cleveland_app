/**
 * Cleveland Bluetooth Utility
 * 
 * This file provides global utility functions that make communicating with the Cleveland LCR Pi
 * via the cl-lcr-daemon.
 * 
 * @see https://github.com/mdunham/cl-lcr-daemon
 * @author Matthew Dunham <matt@hotocoffeydesign.com>
 */

// Silencing netbeans annoying not defined error
if (false) var ble;

/**
 * Enable Bluetooth on the device
 * 
 * @param {function} callback
 * @returns {void}
 */
function enableBluetooth(callback) {
	ble.isEnabled(
		function(){
			callback(true);
		},
		function(){
			// Bluetooth not yet enabled so we try to enable it
			ble.enable(
				function(){
					// bluetooth now enabled
					callback(true);
				},
				function(err){
					navigator.notification.alert('Unable to enable Bluetooth: ' + err.message);
					callback(false);
				}
			);
		}
	);
}

/**
 * Scan for Bluetooth devices that identify as Cl-LCR-Daemon
 * 
 * @param {function} callback
 * @returns {void}
 */
function findDaemon(callback) {
	var devices = [], foundDaemon;
	ble.isEnabled((status) => {
		ble.startScanWithOptions([],{ reportDuplicates: false }, function(device) {
			if (device.name === 'Cleveland LCR Daemon') {
				foundDaemon = true;
				devices.push(device);
			}
		}, function(err){
			navigator.notification.alert('Unable to enable Bluetooth: ' + err.message);
			callback(false);
		});
		
		setTimeout(() => { 
			ble.stopScan(); 
			if (foundDaemon) callback(devices); 
			else setTimeout(() => { findDaemon(callback); }, 1000);
		}, 2500);
	});
}

function connectTo(device_id, success, fail) {
	window.ble_device = device_id;
	ble.connect(device_id, (info) => { console.log('success ble connect ---->', info); success(info); bleNotify(bleResponse, fail); }, fail);
}

function disconnect(device_id, success, fail) {
	ble.disconnect(device_id, success, fail);
}

function bleLCRStatus(callback) {
	ble.write(
		window.ble_device, 
		App.bleServUUID, 
		App.bleCharUUID, 
		stringToByteBuffer('status'), 
		(data) => { console.log('BLE Write Success', data); }, 
		(data) => { console.log('BLE Write Fail', data); }
	);
	
	ble.read(window.ble_device, App.bleServUUID, App.bleCharUUID,
		function(data){
			console.log("Hooray we have data"+JSON.stringify(data));
			console.log('ASCII: ' + data.toString());
			callback(data.toString());
		},
		function(failure){
			alert("Failed to read characteristic from device.");
		}
	);
}

function bleNotify(callback, fail) {
	if ( ! fail) fail = console.log;
	ble.startNotification(window.ble_device, App.bleServUUID, App.bleCharUUID, callback, fail);
}

function bleResponse(data) {
	console.log('BLE Response: ' + bytesToString(data));
}

 function stringToByteBuffer(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

function bytesToString(byteArray) {
	if ('object' !== typeof byteArray) return '';
	let output = '';
	for (var i = 0; i < byteArray.length; i += 2)
		output += String.fromCharCode(byteArray[i]);
	return output;
}