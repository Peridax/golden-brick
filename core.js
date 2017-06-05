function Core() {
	this.userInterval = 5000;
	this.notifierInterval = 2500;
	this.socket = io(server);

	this.price;

	this.info = {
		username: "",
		logged: false,
		bucks: 0,
		bits: 0,
		lastUpdate: Date.now()
	};

	this.onload = function() {
		if (parse(localStorage.getItem('opt_dev'))) {
			console.log('Extension loaded');
		};
	};

	this.notifier = function(data) {
	    if (core.info.logged) {
	    	if ((data.special && (localStorage.getItem('opt_special') == 'true') || localStorage.getItem('opt_special') == undefined) || (!data.special && (localStorage.getItem('opt_item') == 'true') || localStorage.getItem('opt_item') == undefined)) {
		        if (data.bucks == 0 || data.bits == 0) {
		            core.price = 'Free'
		        } else if (data.bucks > 0 && data.bits > 0) {
		            core.price = data.bucks + ' Bucks & ' + data.bits + ' Bits'
		        } else if (data.bits > 0) {
		            core.price = data.bits + ' Bits'
		        } else if (data.bucks > 0) {
		            core.price = data.bucks + ' Bucks'
		        } else {
		            core.price = 'Not for sale'
		        };

		        chrome.notifications.create(data.url, {
		            type: 'list',
		            title: data.special ? 'New Special' : 'New Item',
		            message: '',
		            iconUrl: data.icon,
		            items: [{
		                title: data.name,
		                message: ''
		            }, {
		                title: 'Price',
		                message: core.price
		            }],
		            requireInteraction: true,
		            isClickable: true
		        }, function() {
		            core.url = data.url;
		            setTimeout(function() {
		                chrome.notifications.clear(data.url);
		            }, 30000);
		        });

		        if (parse(localStorage.getItem('opt_audio')) || localStorage.getItem('opt_audio') == undefined) {
		        	responsiveVoice.speak(data.special ? "New Special" : "New Item");
		        };
		    };
	    };
	};

	this.sockets = function() {
		core.socket.on('connect', function(data) {
			localStorage.setItem('connected', 'true');
			chrome.notifications.clear('connected');
			chrome.notifications.create('connected', {
				type: 'basic',
				title: 'Connected',
				message: 'Successfully connected to peridax\'s server',
				iconUrl: '../assets/images/logo.png'
			});
		});

		core.socket.on('disconnect', function() {
			localStorage.setItem('connected', 'false');
			chrome.notifications.clear('disconnected');
			chrome.notifications.create('disconnected', {
				type: 'basic',
				title: 'Disconnected',
				message: 'Disconnected from peridax\'s server',
				iconUrl: '../assets/images/logo.png'
			});
		});

		core.socket.on('new item', function(data) {
			core.notifier(data);
		});
	};

	this.handler = function() {
		// Notification Handler
		chrome.notifications.onClicked.addListener(function(notificationID, buttonIndex) {
			chrome.tabs.create({
				url: notificationID
			});

			chrome.notifications.clear(notificationID);
		});

		// Message Passing handler
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		    if (request.uninstall) {
		      	uninstall();
		    };
		});
	};
};