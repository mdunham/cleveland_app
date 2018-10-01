/**
 * Index Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */

var IndexController = function(){
	var
	
		/**
		 * Object cache for the index page
		 * 
		 * @type type
		 */
		$cache = {},
				
		/**
		 * This is called when the controller is first used
		 * 
		 * @argument object $page jQuery object
		 * @returns void
		 */
		initialize = function () {
			$cache.page = jQuery('#page-index');
			$cache.userid = $cache.page.find('#txt-username');
			$cache.password = $cache.page.find('#txt-password');
			$cache.login = $cache.page.find('#login-form');
		},

		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			var username = App.Storage.getItem('username');
			$cache.userid.val(username);
			$cache.login.on('submit', function(e){
				e.preventDefault();
				var
					user = $cache.userid.val(),
					pass = $cache.password.val();
					
				App.Storage.setItem('username', user);
				$.mobile.loader().show();
				console.log('login');
				Api.login(user, pass, function(){
					$.mobile.loader().hide();
					$.mobile.navigate('#page-truck');
					console.log('success');
				}, function(){
					$.mobile.loader().hide();
					swal({
						'icon': 'error',
						'title': 'Password Incorrect',
						'timer': 2000,
						'buttons': false
					});
				});
				return false;
			});
		},

		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function ($page) {
			$cache.login.off('submit');
		};
		

	return {
		
		/**
		 * This is where we track events 
		 * 
		 * @argument string event
		 * @argument object $page jQuery object of the source page
		 * @return void
		 */
		trigger: function (event, $page) {
			switch (event) {
				case 'init':
					initialize();
					break;
				case 'show':
					onBeforeShow($page);
					break;
				case 'hide':
					onBeforeHide($page);
					break;
			}

		}

	};
};
