Core.prototype.user = function() {
	$.get(`https://www.brick-hill.com/API/current_user`).success(function(Response) {

		core.info.logged = false; if (typeof Response == "object" && "ID" in Response) core.info.logged = true;
		if (core.info.logged) {
			core.info.bucks = Response.Bucks; core.info.bits = Response.Bits;
			core.info.username = Response.Username;
			core.info.id = Response.ID;

			if (core.startup) {
				core.socket.emit('new', {username: Response.Username});
				core.startup = false;
			}
		};

		localStorage.setItem('username', core.info.username);
		localStorage.setItem('logged', core.info.logged);
		localStorage.setItem('bucks', core.info.bucks);
		localStorage.setItem('bits', core.info.bits);
		localStorage.setItem('id', core.info.id);

		clearInterval(core.userIntervalWrap);
		core.userInterval = 5000;
		core.info.lastUpdated = Date.now();
		core.userIntervalWrap = setInterval(core.user, core.userInterval);

	}).fail(function() {
		clearInterval(core.userIntervalWrap);
		core.userInterval = 45000;
		core.info.lastUpdated = Date.now();
		core.userIntervalWrap = setInterval(core.user, core.userInterval);
		console.error('Failed to fetch user data');
	});
};