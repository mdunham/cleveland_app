var App = App || {};
App.Settings = App.Settings || {};
App.Settings.apiUrl = 'https://app.clevelandpetroleum.com';
App.Settings.loginUrl = App.Settings.apiUrl + '/login';
App.Storage = window.localStorage;
App.clientVersion = '1.0.30';
App.bleServUUID = '4DD566B5-BA51-4AE5-AD9D-0694349E7205';
App.bleCharUUID = '4DD566B5-BA51-4AE5-AD9D-0694349E7205';
App.DB = {};
App.SupportedEvents = [
	'pagebeforeshow', 
	'pagecontainershow', 
	'pagecontainerchange', 
	'pagehide', 
	'resume', 
	'pause', 
	'online', 
	'offline', 
	'pagecreate'
];

window.lastCoord = {
	latitude: 35.98466900,
	longitude: -95.88583200
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}