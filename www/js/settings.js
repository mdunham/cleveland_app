var App = App || {};
App.Settings = App.Settings || {};
App.Settings.apiUrl = 'https://app.clevelandpetroleum.com';
App.Settings.loginUrl = App.Settings.apiUrl + '/login';
App.Storage = window.localStorage;
App.clientVersion = '1.0.30';
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

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}