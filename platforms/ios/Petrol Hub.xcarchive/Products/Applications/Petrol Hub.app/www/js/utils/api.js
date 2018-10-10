/**
 * Api Utility 
 * 
 * This allows you to query the CoachingU.com's online RESTful API
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */
var Api = (function(){
	
	var 
	
		/**
		 * Prep data for ajax submission
		 * 
		 * @param string type POST | GET | HEAD | PUT
		 * @param object data
		 * @returns object 
		 */
		_prep = function(type, data) {
			data['_method'] = type;
			data['time'] = (new Date()).getTime().toString();
			data['device'] = {
				uuid:     device.uuid         ? device.uuid         : '',
				model:    device.model        ? device.model        : '',
				platform: device.platform     ? device.platform     : '',
				version:  device.version      ? device.version      : '',
				mfg:      device.manufacturer ? device.manufacturer : '',
				serial:   device.serial       ? device.serial       : ''
			};
			return data;
		}

		/**
		 * Ajax Post Wrapper
		 * 
		 * @argument string url
		 * @argument mixed data
		 * @argument string callback
		 * @returns void
		 */
		 _post = function(url, data, callback){
			data = _prep('POST', data);
			$.ajax({
				type: 'POST',
				url: url,
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data: data,
				success: function (data) {
					callback(data);
				},
				error: function(xhr, errorType, httpError) {
					callback(false);
				}
			});
		},
		
		/**
		 * Ajax Get Wrapper
		 * 
		 * @argument string url
		 * @argument mixed data
		 * @argument string callback
		 * @returns void
		 */
		_get = function(url, data, callback){
			data = _prep('GET', data);
			$.ajax({
				type: 'GET',
				url: url,
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data: data,
				success: function (data) {
					callback(data);
				},
				error: function(xhr, errorType, httpError) {
					callback(false);
				}
			});
		};
	
	return {
		
		get: _get,
		post: _post,
		
		/**
		 * Attempt to authenticate a user
		 * 
		 * @argument string user
		 * @argument string password
		 * @argument function onSuccess Returns the user details
		 * @argument function onFail
		 * @return object | false If the login fails
		 */
		login: function(user, password, onSuccess, onFail){
			var 
				data = {
					username: user,
					password: password
				},
				onComplete = function(response) {
					console.log(response);
					if (typeof response === 'object') {
						if (true === response.success) {
							App.DB['Auth'] = {
								'user': response.user,
								'user_type': response.type,
								'profile': response.data,
								'user_token': response.token
							};
							window.currentUser = response.user;
							Api.post(App.Settings.apiUrl + '/push-tokens/add.json', {
								user_id: window.currentUser.id,
								token: window.pushToken
							}, function(response){});
							App.Storage.setItem('auth-saved', 'true');
							App.Storage.setItem('Auth', JSON.stringify(App.DB['Auth']));
							onSuccess(response);
						} else {
							onFail(response);
						}
					} else {
						console.log('Error: No response object');
					}
				};
			
			onSuccess = typeof onSuccess === 'function' ? onSuccess : function(){};
			onFail = typeof onFail === 'function' ? onFail : function(){};
						
			_post(App.Settings.loginUrl, data, onComplete);
		},
		
		
		
		/**
		 * Validate a user token
		 * 
		 * @returns void
		 */
		validateToken: function(token, callback) {
			_post(App.Settings.apiUrl + 'users/validate', {
				'token': token
			}, function(response){
				if (typeof response === 'string') {
					callback(response === 'true' ? true : false);
				} else {
					callback(false);
				}
			});
		},
		
		/**
		 * Reset Password
		 * 
		 * @returns void
		 */
		resetPassword: function(email, callback) {
			_post(App.Settings.apiUrl + 'users/forgot', {
				'email': email
			}, function(response){
				if (typeof response === 'string') {
					callback(response === 'true' ? true : false);
				} else {
					callback(false);
				}
			});
		},
		
		/**
		 * Load key settings from the API
		 * 
		 * @returns void
		 */
		loadSettings: function(){
			
		}
		
	};
})();
