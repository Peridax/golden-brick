Core.prototype.user = function() {
	$.get('https://www.brick-hill.com/money').success(function(data) {
		if ($('[href*="/user?id="]', data).length) {
			core.info.username = $('#welcome', data).text().split('Welcome, ').join('');
			core.info.logged = true;
			core.info.bucks = parseInt($('[title="bucks"]', data).text());
			core.info.bits = parseInt($('[title="bits"]', data).text());
		} else {
			core.info.logged = false;
		};

		// Banning users
		for (i in banned) {
			if (core.info.username == banned[i]) {
				uninstall('You are banned from using this extension');
			};
		};

		// Local Storage
		localStorage.setItem('username', core.info.username);
		localStorage.setItem('logged', core.info.logged);
		localStorage.setItem('bucks', core.info.bucks);
		localStorage.setItem('bits', core.info.bits);
		core.info.lastUpdated = Date.now();
	});

	// Interval For Updating
	clearInterval(core.userIntervalWrap);
	core.userIntervalWrap = setInterval(core.user, core.userInterval);
};