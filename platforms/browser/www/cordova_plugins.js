cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/src/browser/SplashScreenProxy.js",
        "id": "cordova-plugin-splashscreen.SplashScreenProxy",
        "pluginId": "cordova-plugin-splashscreen",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "pluginId": "cordova-plugin-device",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-barcodescanner/www/barcodescanner.js",
        "id": "cordova-plugin-barcodescanner.BarcodeScanner",
        "pluginId": "cordova-plugin-barcodescanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
        "file": "plugins/cordova-plugin-printer/www/printer.js",
        "id": "cordova-plugin-printer.Printer",
        "pluginId": "cordova-plugin-printer",
        "clobbers": [
            "plugin.printer",
            "cordova.plugins.printer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/browser/notification.js",
        "id": "cordova-plugin-dialogs.notification_browser",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
        "id": "cordova-plugin-fcm.FCMPlugin",
        "pluginId": "cordova-plugin-fcm",
        "clobbers": [
            "FCMPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-directions/www/directions.js",
        "id": "cordova-plugin-directions.Directions",
        "pluginId": "cordova-plugin-directions",
        "clobbers": [
            "directions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-ble-central/www/ble.js",
        "id": "cordova-plugin-ble-central.ble",
        "pluginId": "cordova-plugin-ble-central",
        "clobbers": [
            "ble"
        ]
    },
    {
        "file": "plugins/cordova-plugin-ble-central/src/browser/BLECentralPlugin.js",
        "id": "cordova-plugin-ble-central.BLECentralPlugin",
        "pluginId": "cordova-plugin-ble-central",
        "merges": [
            "ble"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/src/browser/StatusBarProxy.js",
        "id": "cordova-plugin-statusbar.StatusBarProxy",
        "pluginId": "cordova-plugin-statusbar",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-background-mode/www/background-mode.js",
        "id": "cordova-plugin-background-mode.BackgroundMode",
        "pluginId": "cordova-plugin-background-mode",
        "clobbers": [
            "cordova.plugins.backgroundMode",
            "plugin.backgroundMode"
        ]
    },
    {
        "file": "plugins/cordova-plugin-background-mode/src/browser/BackgroundModeProxy.js",
        "id": "cordova-plugin-background-mode.BackgroundMode.Proxy",
        "pluginId": "cordova-plugin-background-mode",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-splashscreen": "5.0.2",
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-compat": "1.2.0",
    "cordova-plugin-barcodescanner": "0.7.4",
    "cordova-plugin-printer": "0.7.3",
    "cordova-plugin-geolocation": "4.0.1",
    "cordova-plugin-dialogs": "2.0.1",
    "cordova-plugin-fcm": "2.1.2",
    "cordova-plugin-directions": "0.4.4",
    "cordova-plugin-ble-central": "1.2.2",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-statusbar": "2.4.2",
    "cordova-plugin-background-mode": "0.7.2"
}
// BOTTOM OF METADATA
});