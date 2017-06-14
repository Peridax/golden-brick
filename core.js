function Core() {
	this.userInterval = 5000;
	this.notifierInterval = 2500;
	this.socket = io(server);
	this.startup = true;

	this.price;

	this.info = {
		username: "",
		logged: false,
		bucks: 0,
		bits: 0,
		id: "",
		lastUpdate: Date.now()
	};

	this.onload = function() {
		if (parse(localStorage.getItem('opt_dev'))) {
			console.log('Extension loaded');
		};
	};

	this.sockets = function() {
		core.socket.on('disconnect', function() {
			localStorage.setItem('connected', 'false');
			chrome.notifications.clear('disconnected');
			chrome.notifications.create('disconnected', {
				type: 'basic',
				title: 'Disconnected From Server',
				message: 'Server crashed! :(',
				iconUrl: '../assets/images/logo.png'
			});

			core.startup = true;
		});

		core.socket.on('message', function(data) {
			chrome.notifications.clear('message');
			chrome.notifications.create('message', {
				type: 'basic',
				title: data.title,
				message: data.message,
				iconUrl: '../assets/images/logo.png'
			});

			if (data.type == "connected") {
				localStorage.setItem('connected', 'true');
			};
		});

		core.socket.on('announcement', function(data) {
			chrome.notifications.clear('announcement');
			chrome.notifications.create('announcement', {
				type: 'basic',
				title: data.title,
				message: data.message,
				iconUrl: '../assets/images/logo.png',
				requireInteraction: true
			}, function() {
				setTimeout(function() {
                	chrome.notifications.clear('announcement');
            	}, 30000);
			});
		});

		core.socket.on('dev', function(data) {
			if (parse(localStorage.getItem('opt_dev'))) {
				chrome.notifications.clear('dev');
				chrome.notifications.create('message', {
					type: 'basic',
					title: data.title,
					message: data.message,
					iconUrl: '../assets/images/logo.png'
				});
			};
		});

		core.socket.on('key', function(data) {
			localStorage.setItem('key', data);
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

		// Long Lived Connection
		chrome.extension.onConnect.addListener(function(port) {
			core.socket.removeListener('console');
			core.socket.on('console', function(data) {
				if (data.type == "log") {
					port.postMessage({type: "log", log: data.int});
				};
			});

			port.onMessage.addListener(function(data) {
	           	if (data.type == "user count") {
	           		core.socket.emit('admin', {key: localStorage.getItem('key'), type: data.type});
	           	} else if (data.type == "users") {
	           		core.socket.emit('admin', {key: localStorage.getItem('key'), type: data.type});
	           	} else if (data.type == "message") {
	           		core.socket.emit('admin', {key: localStorage.getItem('key'), type: data.type, message: data.message});
	           	};
	      	});
	 	});
	};
};