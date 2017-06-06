// Commit test.

Core.prototype.user = function() {
	$.get(`https://www.brick-hill.com/API/current_user`, function(Response) {

		core.info.logged = false; if (typeof Response == "object" && "ID" in Response) core.info.logged = true;
		if (core.info.logged) {
			core.info.bucks = Response.Bucks; core.info.bits = Response.Bits;
			core.info.username = Response.Username;
		}

		for (u in banned) {
			if (core.info.username == banned[u]) uninstall('You are banned from using this extension.');
		}

		localStorage.setItem('username', core.info.username); localStorage.setItem('logged', core.info.logged);
		localStorage.setItem('bucks', core.info.bucks); localStorage.setItem('bits', core.info.bits);

		core.info.lastUpdated = Date.now();

	});
}
