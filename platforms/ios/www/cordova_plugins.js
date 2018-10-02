cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-barcodescanner.BarcodeScanner",
    "file": "plugins/cordova-plugin-barcodescanner/www/barcodescanner.js",
    "pluginId": "cordova-plugin-barcodescanner",
    "clobbers": [
      "cordova.plugins.barcodeScanner"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification",
    "file": "plugins/cordova-plugin-dialogs/www/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-fcm.FCMPlugin",
    "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
    "pluginId": "cordova-plugin-fcm",
    "clobbers": [
      "FCMPlugin"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.Coordinates",
    "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "Coordinates"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.PositionError",
    "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "PositionError"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.Position",
    "file": "plugins/cordova-plugin-geolocation/www/Position.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "Position"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.geolocation",
    "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "navigator.geolocation"
    ]
  },
  {
    "id": "cordova-plugin-printer.Printer",
    "file": "plugins/cordova-plugin-printer/www/printer.js",
    "pluginId": "cordova-plugin-printer",
    "clobbers": [
      "plugin.printer",
      "cordova.plugins.printer"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-directions.Directions",
    "file": "plugins/cordova-plugin-directions/www/directions.js",
    "pluginId": "cordova-plugin-directions",
    "clobbers": [
      "directions"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-compat": "1.2.0",
  "cordova-plugin-barcodescanner": "0.7.4",
  "cordova-plugin-device": "2.0.2",
  "cordova-plugin-dialogs": "2.0.1",
  "cordova-plugin-fcm": "2.1.2",
  "cordova-plugin-geolocation": "4.0.1",
  "cordova-plugin-printer": "0.7.3",
  "cordova-plugin-splashscreen": "5.0.2",
  "cordova-plugin-directions": "0.4.4"
};
// BOTTOM OF METADATA
});