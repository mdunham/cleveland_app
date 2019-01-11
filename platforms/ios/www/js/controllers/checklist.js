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
			try {
				if (response && response.checklistItems) {
					if (response.checklistItems.length) {
						response.checklistItems.map(function(listItem){
							var 
								input = listItem.type === 'radio' ? `<label style="float:left; width: 45%;" class="ui-alt-icon">Yes <input type="radio" name="item${listItem.id}" data-id="${listItem.id}" /></label> <label class="ui-alt-icon" style="width:45%; float: left">No <input name="item${listItem.id}" type="radio" data-id="${listItem.id}" /></label>` : (listItem.type === 'checkbox' ? `<label style="float:left; width: 45%;" class="ui-alt-icon"><input type="checkbox" name="item${listItem.id}" data-id="${listItem.id}" />&nbsp;</label>` :  `<input class="needsclick" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="width: 30%" data-id="${listItem.id}" />`) ,
								inputTpl = `<li data-item-id="${listItem.id}"><strong class="${listItem.type}-type" style="display: block; margin-top: 10px;">${listItem.title}</strong>${input}</li>`,
								tpl = `<div data-id="${listItem.id}" data-role="collapsible" data-collapsed-icon="carat-d" data-iconpos="right" data-expanded-icon="carat-u">
										<h4>${listItem.group_title}</h4>
										<ul data-role="listview" data-group-title="${listItem.group_title}" data-inset="false">
											${inputTpl}
										</ul>
									</div>`;
							if ( ! $cache.page.find('div[data-id="' + listItem.id + '"]').length) {
								if ($cache.page.find('ul[data-group-title="' + listItem.group_title + '"]').length) {
									if ( ! $cache.page.find('li[data-item-id="' + listItem.id + '"]').length)
										$cache.page.find('ul[data-group-title="' + listItem.group_title + '"]').append(inputTpl);
								} else {
									$cache.canvas.before(tpl);
								}
								$cache.page.find('div[data-id="' + listItem.id + '"]').collapsible();
								$cache.page.find('div[data-id="' + listItem.id + '"] [data-role="listview"]').listview();
								$cache.page.find('div[data-id="' + listItem.id + '"] input[type="checkbox"]').checkboxradio();
							}
						});
						$('ul[data-group-title]').listview();
						$('ul[data-group-title]').listview('refresh');
						$('input[type="radio"]').checkboxradio();
						$('input[type="checkbox"]').checkboxradio();
					}
				} else {
					$.mobile.loader().hide();
				}
			} catch (e) {}
			
			setTimeout(() => $.mobile.loader().hide(), 500);
		},

		/**
		 * Determine and set completed checklist items
		 * 
		 * @returns {void}
		 */
		checkComplete = function() {
			$cache.page.find('ul[data-group-title]').each(function(){
				var done = true, $group = $(this).closest('div[data-id]');
				$(this).find('li.ui-li-static').each(function(){
					var $this = $(this), complete = false, $input = $(this).find('input');
					if ($input.attr('type') === 'radio' || $input.attr('type') === 'checkbox') {
						complete = $input.is(':checked');
					} else if ($input.attr('type') === 'text') {
						complete = $input.val().length !== 0;
					}
					if (complete) {
						if ( ! $this.hasClass('complete'))  $this.addClass('complete');
					} else {
						if ($this.hasClass('complete')) $(this).removeClass('complete');
						done = false;
					}
				});
				if (done) {
					if ( ! $group.hasClass('complete'))
						$group.addClass('complete');
				} else {
					if ($group.hasClass('complete')) 
						$group.removeClass('complete');
				}
			});
		},
		
		/**
		 * Check if the list items are complete
		 * 
		 * @returns {bool}
		 */
		startShift = function() {
			var notComplete = false, data = [], gid = guid();
			$cache.page.find('li[data-item-id]').each(function(){
				if ( ! $(this).hasClass('complete')) {
					notComplete = true;
				} else {
					var 
						input = $(this).find('input'),
						value = input.attr('type') === 'text' ? input.val() : (input.is(':checked') ? 'Yes' : 'No');
					data.push({
						user_id: window.currentUser.id,
						truck_id: window.currentTruck.id,
						checklist_item_id: $(this).data('item-id'),
						signiture: '',
						value: value,
						session: gid
					});
				}
			});
			
			if (data.length) {
				data.push({
					signiture: $cache.sig.toDataURL(),
					user_id: window.currentUser.id,
					truck_id: window.currentTruck.id,
					checklist_item_id: 0,
					value: 'Signiture',
					session: gid
				});
			}
			
			if (notComplete) {
				//navigator.notification.alert('Please complete all checklist items');
				//return false;
			}
			
			if ($cache.sig.isEmpty()) {
				//navigator.notification.alert('Please sign the box above');
				//return false;
			}
			
			$.mobile.loader().show();
			var postData = {};
			for (var i = 0; i < data.length; i++) {
				postData['item-' + i] = data[i];
			}
			Api.post(App.Settings.apiUrl + '/checklists/add.json', postData, function(){});
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
				Api.get(App.Settings.apiUrl + '/checklist-items/index.json', {}, processApi);
			}, 30);
			
			$cache.start.on('click', startShift);
			$cache.page.on('change', 'input', checkComplete);
			$cache.page.on('vclick', 'strong.checkbox-type', function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				$(this).closest('li').find('label').trigger('click');
				return true;
			});
			$cache.page.on('vclick', 'input', function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				$(this).focus();
				return true;
			});
//			$cache.page.on('touchend', 'strong.checkbox-type', function(e){
//				e.preventDefault();
//				e.stopImmediatePropagation();
//				$(this).closest('li').find('label').trigger('click');
//				return true;
//			});
			
			if (window.checkInt) { 
				clearInterval(window.checkInt);
			}
			
			window.checkInt = setInterval(checkComplete, 1000);
			
			if ( ! window.watchID) {
				window.GeoUpdateError();
			}
			
			if ( ! window.printerId) {
				//App.setupPrinter();
			}
			
			enableBluetooth((status) => {
				if (status) {
					findDaemon((devices) => {
						devices.map((device) => {
							console.log('Device From Scan - ' + device.name, device);
							if (device.name === 'Cleveland LCR Daemon') {
								connectTo(device.id, (info) => {
									console.log('Checklist Success BLE Connected to Device!!!', info);
									setTimeout(()=> bleLCRStatus((status, message) => {
										if (status === 'ok') {
											let version, product_id;
											[version, product_id] = message.split('|');
											navigator.notification.alert("Successfully Connected to the LCR: " + version);
//											bleLCRSync((data) => {
//												console.log(data, JSON.parse(data.substring(5)));
//											});
										} else {
											navigator.notification.alert("Error Connecting to LCR: " + message);
										}
									}), 1000);
								});
							}
						});
					});
				} else {
					console.log('Checklist Error: Bluetooth not enabled');
				}
			});
			
			if ($cache.sig) {
				$cache.sig.on();
				$cache.sig.clear();
			} else {
				$cache.sig = new SignaturePad($cache.canvas[0]);
			}
		},

		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function ($page) {
			$cache.start.off('click');
			$cache.page.off('change', 'input');
//			$cache.page.off('touchend', 'strong.checkbox-type');
//			$cache.page.off('touchstart', 'strong.checkbox-type');
			$cache.page.off('vclick', 'strong.checkbox-type');
			$cache.page.off('vclick', 'input');
			$cache.sig.off();
			if (window.checkInt) { 
				clearInterval(window.checkInt);
			}
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
				case 'orientationchange':
					resizeCanvas();
					break;
			}

		}

	};
};
