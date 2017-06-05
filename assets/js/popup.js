function Popup() {
	this.timeout = false;
	this.admin = false;
	this.version = version;
	this.options = [{
		name: "Item Notifier",
		id: "opt_item",
		default: true,
		handler: function() {
			localStorage.setItem(this.id, !parse(localStorage.getItem(this.id)));
			$('#' + this.id).prop('checked', parse(localStorage.getItem(this.id)));
		}
	}, {
		name: "Special Notifier",
		id: "opt_special",
		default: true,
		handler: function() {
			localStorage.setItem(this.id, !parse(localStorage.getItem(this.id)));
			$('#' + this.id).prop('checked', parse(localStorage.getItem(this.id)));
		}
	}, {
		name: "Audio",
		id: "opt_audio",
		default: true,
		handler: function() {
			localStorage.setItem(this.id, !parse(localStorage.getItem(this.id)));
			$('#' + this.id).prop('checked', parse(localStorage.getItem(this.id)));
		}
	}, {
		name: "Display Info",
		id: "opt_info",
		default: true,
		handler: function() {
			localStorage.setItem(this.id, !parse(localStorage.getItem(this.id)));
			$('#' + this.id).prop('checked', parse(localStorage.getItem(this.id)));
			popup.info();
		}
	}, {
		name: "Dev Mode",
		id: "opt_dev",
		default: false,
		handler: function() {
			localStorage.setItem(this.id, !parse(localStorage.getItem(this.id)));
			$('#' + this.id).prop('checked', parse(localStorage.getItem(this.id)));
		}
	}];
	this.formats = [{
		sign: "**",
		first: "[b]",
		second: "[/b]"
	}];

	this.init = function() {
		popup.reload();

		for (i in popup.options) {
			if (!localStorage.getItem(popup.options[i].id)) {
				localStorage.setItem(popup.options[i].id, popup.options[i].default);
			}

			if (i % 2 == 0) {
				$('.settings .first').append('<div class="option"><label class="siimple-label">' + popup.options[i].name + '</label> <div class="siimple-checkbox"> <input class="opt" type="checkbox" id="' + popup.options[i].id + '"> <label for="' + popup.options[i].id + '"></label> </div></div>');
			} else {
				$('.settings .second').append('<div class="option"><label class="siimple-label">' + popup.options[i].name + '</label> <div class="siimple-checkbox"> <input class="opt" type="checkbox" id="' + popup.options[i].id + '"> <label for="' + popup.options[i].id + '"></label> </div></div>');
			}

			$('#' + popup.options[i].id).prop('checked', parse(localStorage.getItem(popup.options[i].id)));
		}

		$.get('https://www.brick-hill.com/forum/').success(function(data) {
			$('#quick-select').html('');

			$('.forumColumn', data).each(function(i) {
				$('#quick-select').append('<option value="' + (i + 1) + '">' + $(this).find('.title').text() + '</option>');
			});

			$('#quick-post').removeClass('siimple-btn--disabled');
		});

		popup.info();
		popup.handler();
	};

	this.post = function() {
		var id = $('#quick-select').val(),
			title = $('#quick-title').val(),
			body = $('#quick-body').val();

		$('#quick-post').addClass('siimple-btn--disabled');

		for (i in popup.formats) {
			body = body.format(popup.formats[i].sign, popup.formats[i].first, popup.formats[i].second);
		}

		if (title.length >= 2 && title.length <= 60 && body.length >= 10 && body.length <= 3000 && id) {
			$.post('https://www.brick-hill.com/forum/create?id=' + id, {title: title, body: body}).success(function(data) {
				if ($('[href*="/report?type=thread&id="]', data).length > 0) {
					var id = $('[href*="/report?type=thread&id="]', data).attr('href').split('/report?type=thread&id=').join('');

					popup.notify('done', 'Thread successfully created! <a class="anchor" href="https://www.brick-hill.com/forum/thread?id=' + id + '" target="_blank">View thread</a>', 8000);
					popup.empty();
				} else {
					popup.notify('error', 'You must wait before quick posting again.');
				}

				$('#quick-post').removeClass('siimple-btn--disabled');
			}).fail(function() {
				popup.notify('error', 'Connection failed, please try again.');
				$('#quick-post').removeClass('siimple-btn--disabled');
			});
		} else {
			if ((title.length < 2 || title.length > 60) && (body.length < 10 || body.length > 3000)) {
				popup.notify('error', 'Title must be between 2 - 60 characters.<br>Body must be between 10 - 3000 characters.');
			} else if (title.length < 2 || title.length > 60) {
				popup.notify('error', 'Title must be between 2 - 60 characters.');
			} else if (body.length < 10 || body.length > 3000) {
				popup.notify('error', 'Body must be between 10 - 3000 characters.');
			}

			$('#quick-post').removeClass('siimple-btn--disabled');
		}
	};

	this.contact = function() {
		var title = $('#contact-title').val(),
			body = $('#contact-body').val();

		if (!popup.timeout) {
			if (title.length >= 2 && title.length <= 60 && body.length >= 10 && body.length <= 3000) {
				$('#contact-post').addClass('siimple-btn--disabled');

				$.post('https://www.brick-hill.com/messages/compose', {title: title, recipient: 12, message: body, send: "Send"}).success(function(data) {
					popup.notify('done', 'Success!', 8000);
					popup.timeout = true;
					popup.empty();

					setTimeout(function() {
						popup.timeout = false;
					}, 30000);

					$('#contact-post').removeClass('siimple-btn--disabled');
				}).fail(function() {
					popup.notify('error', 'Connection failed, please try again.');
					$('#contact-post').removeClass('siimple-btn--disabled');
				});
			} else {
				if ((title.length < 2 || title.length > 60) && (body.length < 5 || body.length > 3000)) {
					popup.notify('error', 'Title must be between 2 - 60 characters.<br>Body must be between 5 - 3000 characters.');
				} else if (title.length < 2 || title.length > 60) {
					popup.notify('error', 'Title must be between 2 - 60 characters.');
				} else if (body.length < 5 || body.length > 3000) {
					popup.notify('error', 'Body must be between 5 - 3000 characters.');
				}
			}
		} else {
			popup.notify('error', 'You are contacting us too fast, please do not abuse this system.');
		}
	};

	this.notify = function(type, html, duration) {
		var random = this.randomNotify(0, 1000)

		$('body').append('<div id="' + random + '" class="notification siimple-alert siimple-alert--' + type + '">' + html + '</div>');

		if ($('.notification').length > 1) {
			$('.notification').animate({
				bottom: "-=120px"
			}, 220, () => {
				$('.notification').not('#' + random).remove();

				$('#' + random).animate({
					bottom: "+=120px"
				}, 220, () => {
					setTimeout(function() {
						$('#' + random).animate({
							bottom: "-=120px"
						}, 220, () => {
							$('#' + random).remove();
						});
					}, (duration || 5000));
				});
			});
		} else {
			$('#' + random).animate({
				bottom: "+=120px"
			}, 220, () => {
				setTimeout(function() {
					$('#' + random).animate({
						bottom: "-=120px"
					}, 220, () => {
						$('#' + random).remove();
					});
				}, (duration || 5000));
			});
		}
	};

	this.handler = function() {
		$(window).keypress(function(event) {
			if (event.which == 13 && $('#login-password').is(':focus')) {
				popup.login();
			}

			if (event.which == 13 && $('#status').is(':focus')) {
				popup.status();
			}
		});

		$('.opt').change(function() {
			for (i in popup.options) {
				if (popup.options[i].id == $(this).attr('id')) {
					popup.options[i].handler();
				}
			}
		});

		$('.why').click(function() {
			popup.notify('done', 'You need to login to your <a class="anchor" href="https://www.brick-hill.com/" target="_blank">Brick-Hill</a> account in order for the extension to work properly, this login form safely logs you in.', 12000);
		});

		$('#login-button').click(function() {
			popup.login($('#login-username').val(), $('#login-password').val());
		});

		$('.help').click(() => { popup.display('#help') });
		$('.dashboard').click(() => { popup.display('#dashboard') });
		$('.admin').click(() => { popup.display('#admin')} );

		$('.logout').click(popup.logout);
		$('#quick-post').click(popup.post);
		$('#contact-post').click(popup.contact);
	};

	this.randomNotify = function(min, max) {
		var num = random(min, max) ** 2;

		if ($('#' + num).length > 0) {
			this.randomNotify();
		} else {
			return num;
		}
	};

	this.display = function(element, display) {
		popup.admin = false;

		for (i in admins) {
			if (localStorage.getItem('username').toLowerCase() == admins[i]) {
				popup.admin = true;
			}
		}

		$('#login').css('display', 'none');
		$('#dashboard').css('display', 'none');
		$('#help').css('display', 'none');
		$('#admin').css('display', 'none');

		if (!popup.admin) {
			$('.admin').css('display', 'none');
		} else {
			$('.admin').css('display', 'block');
		};
		
		$(element).css('display', (display || 'block'));
	};

	this.info = function() {
		if (parse(localStorage.getItem('opt_info'))) {
			$('.info').css('display', 'block');
		} else {
			$('.info').css('display', 'none');
		}
		
		if (parse(localStorage.getItem('logged'))) {
			$('.version span').text(manifest.version);

			$.get('https://www.brick-hill.com/search/online').success(function(data) {
				$(".online span").html($('tbody', data).length);
			});

			$.get('https://www.brick-hill.com/API/games/online_servers').success(function(data) {
				$('.servers span').text(data["activeServers"]);
			});

			if (parse(localStorage.getItem('connected'))) {
				$('.connected span').text('connected');
				$('.connected span').addClass('siimple-color--green');
			} else {
				$('.connected span').text('disconnected');
				$('.connected span').addClass('siimple-color--red');
			}
		}
	};

	this.reload = function() {
		if (parse(localStorage.getItem('logged'))) {
			popup.display('#dashboard');
		} else {
			popup.display('#login', 'flex');
		}

		popup.info();
	};

	this.login = function(user = $('#login-username').val(), pass = $('#login-password').val()) {
		$('#login-button').addClass('siimple-btn--disabled');

		$.post('https://www.brick-hill.com/login/', {username: user, password: pass, ln: "Login"}).success(function(data) {
			if ($('#welcome', data).length > 0) {
				localStorage.setItem('logged', 'true');
				localStorage.setItem('username', user);
				localStorage.setItem('bucks', parseInt($('[title="bucks"]', data).text().split(' ').join('')));
				localStorage.setItem('bits', parseInt($('[title="bits"]', data).text().split(' ').join('')))
				localStorage.setItem('id', parseInt($('a:contains("You")', data).attr('href').split('/user?id=').join('')));

				popup.reload();
				popup.empty();

				popup.notify('done', 'Logged in as <b>' + user + '</b>');
			} else {
				popup.notify('error', 'Unable to login, please try again.');
			}

			$('#login-button').removeClass('siimple-btn--disabled');
		}).fail(function() {
			popup.notify('error', 'Connection failed, please try again.');
			$('#login-button').removeClass('siimple-btn--disabled');
		});
	};

	this.logout = function() {
		$.post('https://www.brick-hill.com/logout/').success(function(data) {
			if ($('#welcome', data).length == 0) {
				localStorage.setItem('logged', 'false');
				popup.reload();

				popup.notify('done', 'Logged out');
			} else {
				popup.notify('error', 'Error logging out, please try again');
			}
		});
	};

	this.empty = function() {
		$('input').val('');
		$('textarea').val('');
	};
}

const popup = new Popup();
popup.init();