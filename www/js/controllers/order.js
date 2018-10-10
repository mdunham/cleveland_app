/**
 * Order Controller 
 * 
 * This controls the core application functionality
 * 
 * @author Matthew Dunham <matt@hotcoffeydesign.com>
 * @type   object
 */

var OrderController = function () {
	var
	
		/**
		 * Object cache for the index page
		 * 
		 * @type type
		 */
		$cache = {},
		
		printStyles = `<style>button, a, div.summary {display: none;}.o-table:before {content: "";background: url('http://162.214.2.64/~cleveland/customer-portal/img/logo_small.png') no-repeat bottom center;width: 200px;height: 20px;display: block;margin: 0px auto 10px;background-size: contain;padding-top: 20px;padding-bottom: 0px;}body {font-family: Arial, Helvetica Neue, Helvetica;font-size: 80%;}.o-table {position: relative;margin-left: -15px;margin-right: -15px;padding: 0;margin-top: -9px;background: #FFF;box-shadow: 0 0 10px -2px rgba(0,0,0,0.6);}.t-headers{background-color: #394365;color: #FFF;font-size: 14px;font-weight: 400!important;display:block;}.o-table .col-2 {flex: 2;padding: 15px;text-align: left;}.o-table .t-values .col-2, .o-table .t-values .col-4 {font-size: 15px;}.o-table .col-4 {flex: 1;padding: 14px;}.t-headers .col-2, .t-headers .col-4 {padding-bottom: 5px;}.o-table .row {display: flex;}.t-values {background: #FFF;font-size: 16px;display:block;}.t-values {max-height: 40vh;overflow: auto;}.t-values .row + .row {border-top: 1px solid #e0e0e0;}.note-box {padding: 20px;}.dates {border-top: 1px solid #c1c1c1;padding-top: 20px;}</style>`,
			
		/**
		 * This is called when the controller is first used
		 * 
		 * @argument object $page jQuery object
		 * @returns void
		 */
		initialize = function () {
			$cache.page = jQuery('#page-order');
			$cache.title = $cache.page.find('h1.title');
			$cache.orderTable = $cache.page.find('.o-table');
			$cache.orderTableHeaders = $cache.page.find('.t-headers');
			$cache.orderTableValues = $cache.page.find('.t-values');
			$cache.dirSlideToggle = $cache.page.find('a.toggle-slide');
			$cache.startFuel = $cache.page.find('#start_fuel_btn');
			$cache.addNote = $cache.page.find('#add_note_btn');
			$cache.orderNotes = $cache.page.find('.note-box');
			$cache.payNow = $cache.page.find('#pay_now_btn');
			$cache.addItem = $cache.page.find('#add-item');
			$cache.curRoute = false;
			$cache.orderNote = $cache.page.find('#order_note');
			$cache.route;
		},
			
		/**
		 * Pay for order show payment options
		 * 
		 * @returns {void}
		 */
		payNow = function() {
			var 
				routeId = window.routeOrder[window.routeIndex]
			for (var i = 0; i < window.routeStops.length; i++) {
				if (window.routeStops[i].id === routeId) {
					window.routeCompleted.push({
						index: i,
						id: routeId
					});
					window.routeStops[i].complete = true;
					$('li[data-id="' + routeId + '"]').addClass('complete');
				}
			}
			window.routeIndex++;
			if (window.routeIndex >= window.routeStops.length) {
				navigator.notification.alert('There are no more deliveries.');
				$.mobile.navigate('#page-route-list');
				return;
			}
			
			var date = new Date().toLocaleString(), html = printStyles + $cache.page.find('.ui-content').html() + `<div class="dates">Date of Delivery: ${date}<br>Delivered By: ${window.currentUser.full_name}<br><br><hr>To get more information about your order or to request another delivery call Cleveland Petroleum <strong>1-800-345-5533</strong></div>`;
			
			if ($cache.curRoute.type === 'delivery') {
				App.print(html, 'receipt-' + $cache.curRoute.record.order.id + '-' + $cache.curRoute.record.order.customer.name.replace(',', '').replace(' ', ''));
			} else {
				App.print(html, 'receipt-' + $cache.curRoute.tank.id + '-' + $cache.curRoute.tank.name);
			}
			
			$.mobile.navigate('#page-route');
		},
		
		/**
		 * Add/Edit a note to this order
		 * 
		 * @returns {void}
		 */
		addNote = function() {
			if ($cache.orderNote.is(':visible')) {
				$cache.addNote.text('Add Note');
				$cache.orderNote.hide();
				if ($cache.orderNotes.text().trim()) {
					$cache.orderNotes.append("\n\n" + $cache.orderNote.val());
				} else {
					$cache.orderNotes.append("<strong>Notes:</strong><br>" + $cache.orderNote.val());
				}
				$cache.orderNotes.show();
				$cache.curRoute.record.order.notes = $cache.curRoute.record.order.notes + "\n\n" + $cache.orderNote.val();
				$cache.orderNote.val('');
			} else {
				$cache.addNote.text('Save Note');
				$cache.orderNote.show();
				$cache.orderNote.focus();
			}
		},
		
		/**
		 * Tell the meter to being pumping fuel
		 * 
		 * @returns {void}
		 */
		startFuel = function() {
			
		},
		
		/**
		 * Add an item to the order
		 * 
		 * @returns {void}
		 */
		addItem = function() {
			$cache.orderTableValues.append(`<div data-item-id="1" data-item-name="Labor" data-item-qty="2.4" data-item-total="1389.22" class="row">
				<div class="col-2"><a href="javascript: void(0)" class="remove-item"><i class="fas fa-minus-circle"></i></a>Labor</div>
				<div class="col-4">2.4 hr</div>
				<div class="col-4">$1,389.22</div>
			</div>`);
		},
		
		/**
		 * Setup the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeShow = function ($page) {
			var 
				order, total,
				routeId = window.routeOrder[window.routeIndex],
				curRoute = window.routeStops.filter(function(route){
					return route.id === routeId;
				});
				
			if ( ! curRoute.length) {
				navigator.notification.alert('Invalid Route!');
				$.mobile.navigate('#page-route-list');
				return;
			}
			
			if ( ! $cache.curRoute || $cache.curRoute.id !== curRoute.id) {
				$cache.curRoute = curRoute[0];
				if ($cache.curRoute.type === 'delivery') {
					order = $cache.curRoute.record.order;
					total = numberFormat((order.fuel.price_per_gallon * order.amount_deliver).toFixed(2));
					$cache.orderTableHeaders.find('.col-4 + .col-4').show();
					$cache.orderTableValues.html(`<div class="row">
						<div class="col-2">${order.fuel.name}</div>
						<div class="col-4">${order.amount_deliver} gal</div>
						<div class="col-4">$${total}</div>
					</div>`);
					$cache.addNote.show();
					$cache.addItem.show();
					$cache.payNow.text('Pay Now');
					$cache.orderNote.val('');
					if (order.notes) {
						$cache.orderNotes.html('<strong>Notes:</strong><br>' + order.notes + '<br><br>').show();
						$cache.orderNote.hide();
					} else {
						$cache.orderNotes.html('').hide();
					}
				} else {
					$cache.orderTableHeaders.find('.col-4 + .col-4').hide();
					$cache.addNote.hide();
					$cache.orderNote.hide();
					$cache.addItem.hide();
					$cache.orderTableValues.html(`<div class="row">
						<div class="col-2">${window.currentTruck.product.name}</div>
						<div class="col-4">Refill Truck</div>
					</div>`);
					$cache.orderNote.val('');
					$cache.orderNotes.html('').hide();
					$cache.payNow.text('Refill Complete');
				}
			}
			
			$cache.page.on('vclick', 'a.remove-item', function(e){
				var $this = $(this), name = $this.closest('.row').data('item-name');
				navigator.notification.confirm('Remove "' + name + '" from this order?', function(confirm){
					if (confirm === 1) {
						$this.closest('.row').remove();
					}
				});
			});
			
			$cache.addNote.text('Add Note');
			
			$cache.payNow.on('vclick', payNow);
			$cache.addNote.on('vclick', addNote);
			$cache.startFuel.on('vclick', startFuel);
			$cache.addItem.on('vclick', addItem);
			if ($cache.curRoute && $cache.curRoute.type === 'delivery') {
				$cache.title.text('Order #' + $cache.curRoute.record.order.id);
			} else {
				$cache.title.text('Refill Tank');
			}
		},
		
		/**
		 * Turn off the click events
		 * 
		 * @param object $page jQuery object
		 * @returns void
		 */
		onBeforeHide = function ($page) {
			$cache.payNow.off('vclick');
			$cache.addNote.off('vclick');
			$cache.startFuel.off('vclick');
			$cache.addItem.off('vclick');
			$cache.page.off('vclick', 'a.remove-item');
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
