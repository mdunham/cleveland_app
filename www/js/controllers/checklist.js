/**
 * Index Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */

var ChecklistController = function(){
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
			$cache.page = jQuery('#page-checklist');
			$cache.listbox = $cache.page.find('[data-role="main"]');
			$cache.canvas = $cache.page.find('#signiture');
			$cache.start = $cache.page.find('#btn-submit-shift');
			$cache.sig = false;
		},
		
		/**
		 * Process the response from the API
		 * 
		 * @param {object} response
		 * @returns {void}
		 */
		processApi = function(response) {
			if (response && response.checklistItems) {
				if (response.checklistItems.length) {
					response.checklistItems.map(function(listItem){
						var 
							input = listItem.type === 'checkbox' ? `<input type="checkbox" data-collapsed="false" data-id="${listItem.id}" />` : `<input type="text" data-id="${listItem.id}" />` ,
							tpl = `<div data-id="${listItem.id}" data-role="collapsible" data-collapsed-icon="carat-d" data-iconpos="right" data-expanded-icon="carat-u">
									<h4>${listItem.group_title}</h4>
									<ul data-role="listview" data-inset="false">
									<li>${listItem.title} ${input}</li>
								</ul>
							</div>`;
						if ( ! $cache.page.find('div[data-id="' + listItem.id + '"]').length) {
							$cache.canvas.before(tpl);
							$cache.page.find('div[data-id="' + listItem.id + '"]').collapsible();
							$cache.page.find('div[data-id="' + listItem.id + '"] [data-role="listview"]').listview();
							$cache.page.find('div[data-id="' + listItem.id + '"] input[type="checkbox"]').checkboxradio();
						}
					});
				}
			}
			$.mobile.loader().hide();
		},

		/**
		 * Determine and set completed checklist items
		 * 
		 * @returns {void}
		 */
		checkComplete = function() {
			$cache.page.find('input[data-id]').each(function(){
				var complete = false;
				if ($(this).attr('type') === 'checkbox') {
					complete = $(this).is(':checked');
				} else if ($(this).attr('type') === 'text') {
					complete = $(this).val().length !== 0;
				}
				if (complete) {
					$cache.page.find('div[data-id="' + $(this).data('id') + '"]').addClass('complete');
				} else {
					$cache.page.find('div[data-id="' + $(this).data('id') + '"]').removeClass('complete');
				}
			});
		},
		
		/**
		 * Check if the list items are complete
		 * 
		 * @returns {bool}
		 */
		startShift = function() {
			var notComplete = false, data = [];
			$cache.page.find('div[data-id]').each(function(){
				if ( ! $(this).hasClass('complete')) {
					notComplete = true;
				} else {
					var 
						input = $(this).find('input'),
						value = input.attr('type') === 'text' ? input.val() : (input.is(':checked') ? 'Yes' : 'No');
					data.push({
						user_id: window.currentUser.id,
						truck_id: window.currentTruck.id,
						checklist_item_id: $(this).data('id'),
						signiture: $cache.sig.toDataURL(),
						value: value,
						session: guid()
					});
				}
			});
			if (notComplete) {
				navigator.notification.alert('Please complete all checklist items');
				return false;
			}
			
			if ($cache.sig.isEmpty()) {
				navigator.notification.alert('Please sign the box above');
				return false;
			}
			
			$.mobile.loader().show();
			for (var i = 0; i < data.length; i++) {
				Api.post(App.Settings.apiUrl + '/checklists/add.json', data[i], function(response){
					console.log(response);
				});
			}
			setTimeout(function(){
				$.mobile.navigate('#page-route-list');
			}, 500);
		},

		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			setTimeout(function(){
				$.mobile.loader().show();
			}, 10);
			Api.get(App.Settings.apiUrl + '/checklist-items/index.json', {}, processApi);
			$cache.start.on('vclick', startShift);
			cordova.plugins.printer.check(function (available, count) {
				if (-1 === count) {
					var printCheck = function() {
						cordova.plugins.printer.pick(function (uri) {
							if (uri) {
								window.printerId = uri;
							} else {
								window.printerId = false;
								navigator.notification.alert('Unable to find a printer. You must connect to the printer now.');
								setTimeout(printCheck, 3000);
							}
						});
					}
					
					printCheck();
				} else {
					console.log(available);
				}
			});
			if ($cache.sig) {
				$cache.sig.on();
				$cache.sig.clear();
			} else {
				$cache.sig = new SignaturePad($cache.canvas[0]);
			}
			$cache.page.on('change', 'input', checkComplete);
		},

		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function ($page) {
			$cache.start.off('vclick');
			$cache.page.off('change');
			$cache.sig.off();
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
