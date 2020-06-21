// noinspection ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols,DuplicatedCode
(function(global) {
	console.log('╔═╗╔╦╗╦ ╦╔═╗╦ ╦╔═╗╔╦╗\n' +
				'╠═ ║║║║ ║║  ╠═╣╠═╣ ║ \n' +
				'╚═╝╩ ╩╚═╝╚═╝╩ ╩╩ ╩ ╩ ');

	window.GoogleAnalyticsObject = '__ga__';
	window.__ga__ = function() {
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];

			// noinspection JSUnresolvedVariable
			if (arg.constructor === Object && arg.hitCallback) {
				arg.hitCallback();
			}
		}
	};
	window.__ga__.q = [['create', 'UA-47896346-6', 'auto']];
	window.__ga__.l = Date.now();

	// noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols,JSUnusedLocalSymbols,DuplicatedCode
	define('optional', [], {
		load: function(name, req, onload, config) {
			var onLoadSuccess = function(moduleInstance) {
				onload(moduleInstance);
			};

			var onLoadFailure = function(err) {
				// noinspection JSUnresolvedVariable
				var failedId = err.requireModules && err.requireModules[0];
				console.warn('Could not load optional module: ' + failedId);

				// noinspection JSUnresolvedVariable,JSUnresolvedFunction
				requirejs.undef(failedId);

				// noinspection JSRedundantSwitchStatement
				switch (failedId) {
					default:
						// noinspection JSUnresolvedFunction
						define(failedId, [], function(){return {};});
						break;
				}

				req([failedId], onLoadSuccess);
			};

			req([name], onLoadSuccess, onLoadFailure);
		},
		normalize: function (name, normalize) {
			return normalize(name);
		}
	});

	// noinspection JSUnresolvedFunction,JSUnresolvedVariable
	requirejs.config({
		urlArgs: 'rand=' + (new Date()).getTime(),
		waitSeconds: 300,
		paths: $sys.lib,
		shim: {
			chat: {
				deps: ['jquery', 'simplestorage', 'fingerprint', 'network']
			},
			fingerprint: {
				exports: 'Fingerprint'
			},
			'jquery-mousewheel': {
				deps: ['jquery']
			},
			'jquery-ui': {
				deps: ['jquery']
			},
			'jquery-ui-contextmenu': {
				deps: ['jquery-ui']
			},
			'jquery-custom-scrollbar': {
				deps: ['jquery-mousewheel']
			},
			network: {
				deps: ['socket']
			},
			'moment-timezone': {
				exports: 'moment',
				deps: ['moment']
			},
			twemoji: {
				exports: 'twemoji'
			}
		},
		map: {
			'*': {
				json: 'requirejs-json',
				noext: 'requirejs-noext',
				text: 'requirejs-text'
			}
		}
	});

	// noinspection JSUnresolvedFunction
	requirejs([
		'jquery',
		'jquery-ui',
		'json!../data/emoticons.json',
		'json!../data/normalize.json',
		'json!../data/blacklist.json',
		'emoticons',
		'twemoji',
		'simplestorage',
		'network',
		'jquery-ajax-retry',
		'optional!ga'
	], function($, jqueryui, emoticons_data, normalize_data, blacklist_data, emoticons, twemoji, simplestorage, network, ajaxretry, ga) {
		$(function() {
			if (typeof ga === 'function') {
				ga('send', {
					hitType: 'pageview',
					page: window.location.pathname,
					title: window.location.href
				});
			}

			var $body = $('body');
			var net = network.start({
				servers: ['wss://ws.emupedia.net', 'wss://ws.emuos.net'],
				server: ~window.location.hostname.indexOf('emuos.net') ? 1 : 0,
				mode: 0
			});

			var search = Object.keys(emoticons_data.mapping);
			var replace = Object.values(emoticons_data.mapping);

			var search_regex = {};
			var replace_regex = {};

			// noinspection JSUnresolvedVariable,DuplicatedCode
			for (var profanity1 in blacklist_data.mapping.en) {
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var regex1 = blacklist_data.mapping.en[profanity1][0] + '|';
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var profanity1sorted = blacklist_data.mapping.en[profanity1].sort(function(a, b) {
					return b.length - a.length
				});
				// noinspection JSUnfilteredForInLoop
				for (var p1 in profanity1sorted) {
					// noinspection JSUnfilteredForInLoop
					regex1 += ' ' + profanity1sorted[p1] + '|';
					// noinspection JSUnfilteredForInLoop
					regex1 += ' ' + profanity1sorted[p1] + ' |';
					// noinspection JSUnfilteredForInLoop
					regex1 += profanity1sorted[p1] + ' |';
				}
				// noinspection JSUnfilteredForInLoop
				search_regex[profanity1] = new RegExp(regex1.slice(0, -1), 'gi');
			}

			// noinspection JSUnresolvedVariable,DuplicatedCode
			for (var profanity2 in blacklist_data.replace.en) {
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var regex2 = blacklist_data.replace.en[profanity2][0] + '|';
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				for (var p2 in blacklist_data.replace.en[profanity2]) {
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					regex2 += ' ' + blacklist_data.replace.en[profanity2][p2] + '|';
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					regex2 += ' ' + blacklist_data.replace.en[profanity2][p2] + ' |';
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					regex2 += blacklist_data.replace.en[profanity2][p2] + ' |';
				}
				// noinspection JSUnfilteredForInLoop
				replace_regex[profanity2] = new RegExp(regex2.slice(0, -1), 'gi');
			}

			net.colors = ['rgba(180, 173, 173, 0.973)', '#395fa4', '#159904', 'rgba(128, 128, 128, 0.35)'];

			net.str_replace = function(search, replace, subject) {
				var i = 0;
				var j = 0;
				var k = 0;
				var temp = '';
				var repl = '';
				// noinspection JSUnusedAssignment
				var sl = 0;
				var fl = 0;
				var f = [].concat(search);
				var ff = [];
				var ffl = 0;
				var r = [].concat(replace);
				var s = subject;
				var ra = Object.prototype.toString.call(r) === '[object Array]';
				var sa = Object.prototype.toString.call(s) === '[object Array]';
				s = [].concat(s);

				if (typeof (search) === 'object' && typeof (replace) === 'string') {
					temp = replace;
					replace = [];

					for (i = 0; i < search.length; i += 1) {
						replace[i] = temp;
					}

					temp = '';
					r = [].concat(replace);
					ra = Object.prototype.toString.call(r) === '[object Array]';
				}

				for (i = 0, sl = s.length; i < sl; i++) {
					if (s[i] === '') {
						continue;
					}

					for (j = 0, fl = f.length; j < fl; j++) {
						temp = s[i] + '';
						repl = ra ? (typeof r[j] !== 'undefined' ? r[j] : '') : r[0];
						ff = temp.split(' ');

						for (k = 0, ffl = ff.length; k < ffl; k++) {
							if (ff[k] === f[j]) {
								ff[k] = repl;
							}
						}

						s[i] = ff.join(' ');
					}
				}

				return sa ? s : s[0];
			};

			net.normalize = function(str) {
				return str.replace(/[^\u0020-\u007E]/g, function (letter) {
					var sets = Object.keys(normalize_data.mapping);
					var result = letter;

					for (var i in sets) {
						result = normalize_data.mapping[sets[i]][letter] || letter;
					}

					return result;
				});
			};

			net.remove_numbers = function(str) {
				return str.replace(/[0-9]/g, '');
			};

			net.remove_zalgo = function(str) {
				return str.replace(/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F\u0483-\u0486\u05C7\u0610-\u061A\u0656-\u065F\u0670\u06D6-\u06ED\u0711\u0730-\u073F\u0743-\u074A\u0F18-\u0F19\u0F35\u0F37\u0F72-\u0F73\u0F7A-\u0F81\u0F84\u0e00-\u0eff\uFC5E-\uFC62]{2,}/gi, '');
			};

			net.remove_profanity = function(str) {
				str = str.replace(/  +/g, ' ').trim();

				// noinspection JSUnresolvedVariable
				for (var profanity1 in blacklist_data.mapping.en) {
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					var profanity1sorted = blacklist_data.mapping.en[profanity1].sort(function(a, b) {
						return b.length - a.length
					});

					for (var p1 in profanity1sorted) {
						// noinspection JSUnfilteredForInLoop
						if (str.toLowerCase().split('?').join('').split('!').join('') === profanity1sorted[p1].split('.').join(' ').split('\\$').join('$').trim()) {
							str = profanity1;

							// noinspection JSUnresolvedVariable
							for (var profanity2 in blacklist_data.replace.en) {
								// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
								for (var p2 in blacklist_data.replace.en[profanity2]) {
									// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
									if (str.toLowerCase() === blacklist_data.replace.en[profanity2][p2]) {
										return str = '`' + profanity2 + '`';
									}
								}
							}
						}
					}
				}

				for (var r1 in search_regex) {
					str = str.replace(search_regex[r1], ' ' + r1 + ' ');
				}

				for (var r2 in replace_regex) {
					str = str.replace(replace_regex[r2], ' `' + r2 + '` ');
				}

				return str.replace(/  +/g, ' ').trim();
			};

			net.remove_websites = function(str) {
				// noinspection JSUnresolvedVariable
				for (var website in blacklist_data.mapping.en.website) {
					// noinspection JSUnresolvedVariable,JSUnfilteredForInLoop
					str = str.replace(new RegExp(blacklist_data.mapping.en.website[website], 'gi'), '');
				}

				return str.replace(/  +/g, ' ').trim();
			}

			net.clean = function(str) {
				// noinspection JSUnresolvedFunction
				var subject = $('<div />').text(net.remove_zalgo(net.normalize(str))).html();

				if (~net.client_room_name.text().indexOf('Emupedia')) {
					subject = net.remove_profanity(net.remove_websites(net.remove_numbers(subject)));
				}

				return twemoji.parse(emoticons.parse(net.str_replace(search, replace, subject), {}, emoticons_data.emoticons.mapping), {
					folder: 'svg',
					ext: '.svg'
				});
			};

			net.clean_nicknames = function(str) {
				// noinspection JSUnresolvedFunction
				var subject = $('<div />').text(net.remove_zalgo(net.normalize(str))).html();

				if (~net.client_room_name.text().indexOf('Emupedia')) {
					subject = net.remove_profanity(net.remove_websites(subject));
				}

				return twemoji.parse(emoticons.parse(net.str_replace(search, replace, subject), {}, emoticons_data.emoticons.mapping), {
					folder: 'svg',
					ext: '.svg'
				});
			};

			net.log = function (txt, color, hide) {
				if (typeof color === 'undefined') {
					color = 0;
				}

				if (!net.output_div.length) {
					// noinspection JSUnresolvedVariable
					if (net.config.mode === 1) {
						console.log(txt);
					}

					return false;
				}

				var colors = net.colors;

				color = typeof colors[color] !== 'undefined' ? 'color:' + colors[color] + '; ' : '';

				if (typeof txt === 'object') {
					// noinspection HtmlDeprecatedTag
					txt = '<br><xmp>' + JSON.stringify(txt, null, 2) + '</xmp>';
				}

				var d = new Date();

				var time_stamp = [
					'<span style="color:' + colors[1] + ';">[',
					('0' + d.getHours()).slice(-2),
					':',
					('0' + d.getMinutes()).slice(-2),
					':',
					('0' + d.getSeconds()).slice(-2),
					']&nbsp;</span>'
				].join('');

				var msg_class = typeof hide !== 'undefined' ? (hide > 0 ? 'net_msg_hide' : 'net_msg_hide_last') : 'net_msg';

				net.output_div.append('<div class="'+ msg_class +'" style="' + color + '">' + time_stamp + txt + '</div>');

				setTimeout(function() {
					// noinspection JSUnresolvedFunction
					$('.net_msg_hide').slideUp(200, function() {
						$(this).remove();
					});

					// noinspection JSUnresolvedFunction
					$('.net_msg_hide_last:not(:last-child)').slideUp(200, function() {
						$(this).remove();
					});
				}, hide ? hide : 0);

				var output = net.output_div.get(0);

				if (output.scrollTop + output.offsetHeight > output.scrollHeight - 200) {
					output.scrollTop = output.scrollHeight;
				}
			};

			net.send_input = function() {
				var timestamp = Math.floor(Date.now() / 1000);

				if (!net.last_send) {
					net.last_send = 0;
				}

				if (!net.spam_cap) {
					net.spam_cap = 0;
				}

				if (timestamp - net.last_send < 2) {
					net.spam_cap++;
				} else {
					if (net.spam_cap > 2) {
						if (timestamp - net.last_send < 2) {
							return false;
						}
					}

					net.spam_cap = 0;
				}

				if (net.spam_cap > 2) {
					return false;
				}

				net.last_send = timestamp;

				// noinspection JSUnresolvedFunction
				var msg = net.text_input.val();

				if (msg.trim() === '') {
					return false;
				}

				if (msg.trim().length <= 0) {
					return false;
				}

				// noinspection JSUnresolvedVariable
				if (net.last_msg) {
					if (net.last_msg === msg || ((~msg.indexOf(net.last_msg) || ~net.last_msg.indexOf(msg)) && msg.length >= 10)) {
						return false;
					}
				}

				if (net.last_last_msg) {
					if (net.last_last_msg === msg || ((~msg.indexOf(net.last_last_msg) || ~net.last_last_msg.indexOf(msg)) && msg.length >= 10)) {
						return false;
					}
				}

				if (net.last_last_last_msg) {
					if (net.last_last_last_msg === msg || ((~msg.indexOf(net.last_last_last_msg) || ~net.last_last_last_msg.indexOf(msg)) && msg.length >= 10)) {
						return false;
					}
				}

				if (!(~msg.indexOf(' ') || ~msg.indexOf('.') || ~msg.indexOf(':') || ~msg.indexOf('/') || ~msg.indexOf('\\')) && msg.length >= 20) {
					return false;
				}

				if (msg.charAt(0) === '/') {
					var data = {
						cmd: '',
						data: ''
					};

					msg = msg.substr(1).split(' ');
					data.cmd = msg.shift();
					data.data = msg.join(' ');

					while (data.data.charAt(0) === ' ') {
						data.data = data.data.substr(1);
					}

					if ((data.data.charAt(0) === '[') || (data.data.charAt(0) === '{')) {
						try {
							eval('var json_data=' + data.data);
						} catch (e) {
							var json_data = data.data;
						}

						data.data = json_data;
					}

					if (net.client_cmd(data)) {
						// noinspection JSUnresolvedFunction
						net.text_input.val('');
						return true;
					}

					// noinspection JSUnresolvedFunction
					if (data.cmd === 'nick') {
						if (data.data === '') {
							return false;
						}
					}

					// noinspection JSUnresolvedFunction
					net.send_cmd(data.cmd, data.data);
				} else {
					// noinspection JSUnresolvedFunction
					net.send_cmd('room_msg', msg);
					net.last_last_last_msg = net.last_last_msg;
					net.last_last_msg = net.last_msg;
					net.last_msg = msg;
				}

				// noinspection JSUnresolvedFunction
				net.text_input.val('');
			};

			net.client_cmd = function(argz) {
				if (net.room_info) {
					var muted = net.room_info.data.muted || [];

					switch (argz.cmd) {
						case 'mute':
							if (!~muted.indexOf(argz.data)) {
								muted.push(argz.data);
							}

							// noinspection JSUnresolvedFunction
							net.send_cmd('set_room_data', {muted: false});
							// noinspection JSUnresolvedFunction
							net.send_cmd('set_room_data', {muted: muted});
							return true;
						case 'unmute':
							var index = muted.indexOf(argz.data);

							if (index > -1) {
								muted.splice(index, 1);
							}

							// noinspection JSUnresolvedFunction
							net.send_cmd('set_room_data', {muted: false});
							// noinspection JSUnresolvedFunction
							net.send_cmd('set_room_data', {muted: muted});
							return true;
					}
				}

				return false;
			};

			net.check_msg = function(data) {
				if (net.room_info) {
					var muted = net.room_info.data.muted || [];
					return !~muted.indexOf(data.user);
				}
			};

			net.relay = function(url, data, type, headers) {
				var ajax_retry_timeout		= 1000;
				var ajax_retry_count		= 5;
				var ajax_timeout			= 15 * 1000;
				var cache					= false;
				var data_type				= 'text';

				if (typeof type === 'undefined') {
					type = 'GET';
				}

				if (typeof data !== 'undefined') {
					type = 'POST';
					data_type = 'json';
				} else {
					data = {};
				}

				if (typeof headers === 'undefined') {
					headers = {};
				}

				// noinspection JSUnresolvedFunction
				return $.ajax({
					type: type,
					url: url + (!cache ? '?rand=' + new Date().getTime() : ''),
					headers: headers,
					data: data,
					dataType: data_type,
					cache: cache,
					timeout: ajax_timeout
				}).retry({
					times: ajax_retry_count,
					timeout: ajax_retry_timeout,
					statusCodes: [402, 403, 404, 405, 406, 407, 408, 410, 411, 412, 413, 414, 415, 416, 417, 501, 503, 504, 505]
				});
			}

			net.render_room_select = function(cb) {
				var html = '';

				for (var room in net.rooms) {
					// noinspection JSUnfilteredForInLoop
					if (~room.indexOf('Emupedia')) {
						if (net.room_info) {
							if (room === net.room_info.name) {
								// noinspection JSUnfilteredForInLoop
								html += '<option selected="selected" value="' + room + '" data-online="' + net.rooms[room] + '">' + room + ' (' + net.rooms[room] + ' users)</option>'
							} else {
								// noinspection JSUnfilteredForInLoop
								html += '<option value="' + room + '" data-online="' + net.rooms[room] + '">' + room + ' (' + net.rooms[room] + ' users)</option>'
							}
						} else {
							// noinspection JSUnfilteredForInLoop
							html += '<option value="' + room + '" data-online="' + net.rooms[room] + '">' + room + ' (' + net.rooms[room] + ' users)</option>'
						}
					}
				}

				// noinspection JSUnresolvedFunction
				net.client_rooms.html(html);

				if (typeof cb === 'function') {
					cb();
				}
			}

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable,JSUnusedLocalSymbols
			net.socket.on('connect', function(data) {
				// console.log('connect');
				// console.log(JSON.stringify(data, null, 2));
				net.log('[connected]', 0, 0);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('disconnect', function() {
				// console.log('disconnect');
				net.log('[disconnected]', 0, 0);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('auth.info', function (data) {
				// console.log('auth.info');
				// console.log(JSON.stringify(data, null, 2));

				// noinspection JSUnresolvedVariable
				if (data.login && !simplestorage.get('uid')) {
					simplestorage.set('uid', data.login)
				}

				// noinspection JSUnresolvedVariable
				if (data.login === data.info.nick) {
					net.log('Type /nick <nickname> to set your name', 0);
				}

				// noinspection JSUnresolvedFunction
				net.send_cmd('list', {});
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.info', function (data) {
				// console.log('room.info');
				// console.log(JSON.stringify(data, null, 2));
				net.room_info = data;

				// noinspection JSUnresolvedVariable
				var users_online = Object.keys(net.room_info.users).length;
				// noinspection JSUnresolvedVariable
				var me = net.room_info.me;
				var room = net.room_info.name;
				var users_array_default = [];
				var users_array_nick = [];
				var users_list = '';

				// noinspection JSUnresolvedVariable
				for (var users in data.users) {
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					var user = data.users[users].info.user;
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					var nick = data.users[users].info.nick;

					var is_nick = isNaN(parseInt(nick));

					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable

					if (is_nick) {
						users_array_nick.push([user, nick]);
					} else {
						users_array_default.push([user, nick]);
					}
				}

				users_array_nick.sort(function(a, b) {
					return a[1].localeCompare(b[1]);
				});

				users_array_default.sort();

				var users_obj = {};

				users_array_nick.forEach(function(item) {
					users_obj[item[0]] = item[1];
				});

				users_array_default.forEach(function(item) {
					users_obj[item[0]] = item[1];
				});

				// noinspection JSUnresolvedVariable
				for (var u in users_obj) {
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					var color = u !== me ? net.colors[3] : net.colors[1];
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					users_list += '<div id="room_user_' + u + '" style="color: ' + color + '; word-break: keep-all;" title="' + u + '" data-title="' + u + '">' + net.clean_nicknames(users_obj[u]) + '</div>';
				}

				// noinspection JSUnresolvedVariable
				// noinspection JSUnresolvedVariable,JSUnresolvedFunction
				net.text_input.attr('placeholder', 'You are typing as "' + users_obj[me] + '". To change nick, type /nick and your new nickname.');
				// noinspection JSUnresolvedFunction
				net.client_room_users.html(users_list);
				// noinspection JSUnresolvedFunction
				net.client_room_name.text(room);
				// noinspection JSUnresolvedVariable
				net.client_room_online.text(users_online);
				// noinspection JSUnresolvedFunction
				net.output_div.html('');
				net.log('You are now chatting in ' + room + ' with ' + users_online + ' users');
				// noinspection JSUnresolvedVariable
				$('.ui-selectmenu-text').text(room + ' (' + users_online + ' users)');
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.data', function(data) {
				// console.log('room.data');
				// console.log(JSON.stringify(data, null, 2));
				net.room_info.data = $.extend(net.room_info.data, data.data);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.user_join', function (data) {
				// console.log('room.user_join');
				// console.log(JSON.stringify(data, null, 2));

				if (net.room_info) {
					// noinspection JSUnresolvedVariable
					net.room_info.users[data.user] = data.data;
					// noinspection JSUnresolvedVariable
					net.client_room_online.text(Object.keys(net.room_info.users).length);
					// noinspection JSUnresolvedVariable
					$('.ui-selectmenu-text').text(net.room_info.name + ' (' + Object.keys(net.room_info.users).length + ' users)');
				}
				// noinspection JSUnresolvedVariable
				net.client_room_users.append('<div id="room_user_' + data.data.info.user + '" style="color: ' + net.colors[3] + '; word-break: keep-all;" title="' + data.data.info.user + '" data-title="' + data.data.info.user + '">' + net.clean_nicknames(data.data.info.nick) + '</div>');
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.user_leave', function (data) {
				// console.log('room.user_leave');
				// console.log(JSON.stringify(data, null, 2));

				if (net.room_info) {
					// noinspection JSUnresolvedVariable
					if (net.room_info.users[data.user]) {
						// noinspection JSUnresolvedVariable
						delete net.room_info.users[data.user]
					}
				}

				var $el = $('#room_user_' + data.user);

				setTimeout(function() {
					// noinspection JSUnresolvedFunction
					$el.slideUp(200, function() {
						$(this).remove();
					});
				}, 1000);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.msg', function (data) {
				// console.log('room.msg');
				// console.log(JSON.stringify(data, null, 2));

				if (!net.check_msg(data)) {
					return false;
				}

				var user = data.user;
				var nick = '';

				// noinspection JSUnresolvedVariable
				if (typeof net.room_info !== 'undefined' && typeof net.room_info.users[user] !== 'undefined' && typeof net.room_info.users[user].info !== 'undefined' && typeof net.room_info.users[user].info.nick !== 'undefined') {
					// noinspection JSUnresolvedVariable
					nick = net.clean_nicknames(net.room_info.users[user].info.nick);
				}

				// noinspection JSUnresolvedVariable
				net.log('<span style="color: ' + net.colors[3] + '; overflow: hidden;" title="' + user + '">[' + nick + '] </span>' + net.clean(data.msg));
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.user_info',function(data) {
				// console.log('room.user_info');
				// console.log(JSON.stringify(data, null, 2));

				if (net.room_info) {
					// noinspection JSUnresolvedVariable
					if (net.room_info.users[data.user]) {
						for (var n in data.info) {
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							net.room_info.users[data.user].info[n] = data.info[n];
						}

						// noinspection JSUnresolvedVariable
						if (data.info.nick) {
							// noinspection JSUnresolvedVariable,JSUnresolvedFunction
							$('#room_user_' + data.user).attr('data-title', data.user).data('title', data.user).html(net.clean_nicknames(data.info.nick));
						}

						// noinspection JSUnresolvedVariable
						if (data.user === net.room_info.me) {
							// noinspection JSUnresolvedVariable
							if (data.info.nick) {
								// noinspection JSUnresolvedFunction,JSUnresolvedVariable
								net.text_input.attr('placeholder', 'You are typing as "' + data.info.nick + '". To change it, type /nick and your new nickname.');
							}
						}
					}
				}
			});

			net.socket.on('rooms.list', function(data) {
				// console.log('rooms.list');
				// console.log(JSON.stringify(data, null, 2));

				var sortable = [];
				for (var room in data) {
					// noinspection JSUnfilteredForInLoop
					if (data[room] > 0) {
						// noinspection JSUnfilteredForInLoop
						sortable.push([room, data[room]]);
					}
				}

				sortable.sort(function(a, b) {
					return b[1] - a[1];
				});

				var objSorted = {};
				sortable.forEach(function(item) {
					objSorted[item[0]] = item[1];
				});

				net.rooms = objSorted;
				net.render_room_select(function() {
					// noinspection JSUnresolvedFunction
					$('#client_rooms-button').css('display', 'block');
					// noinspection JSUnresolvedVariable
					if (typeof $.fn.selectmenu === 'function') {
						// noinspection JSUnresolvedFunction
						net.client_rooms.selectmenu('refresh');
					}
				});
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			/*net.socket.on('silent.msg', function (data) {
				// console.log('silent.msg');
				// console.log(JSON.stringify(data, null, 2));

				//net.log(net.clean(data), 1, 10000);
				if (window.top === window) {
					console.log(new Date().toString() + ': ' + data);
				}
			});*/

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('server.help', function (data) {
				// console.log('server.help');
				// console.log(JSON.stringify(data, null, 2));

				var msg = '';

				for (var n in data) {
					// noinspection JSUnfilteredForInLoop
					msg += '<a class="do_cmd" style="cursor: pointer; color: ' + net.colors[2] + ';">/' + data[n] + ' </a> ';
				}

				net.log(msg);

				// noinspection JSUnresolvedFunction
				$('.do_cmd').off('click').on('click', function() {
					// noinspection JSUnresolvedFunction
					net.text_input.val($(this).html());
					net.text_input.focus();
				});
			});

			var chat_ui = '<div id="client_container" class="client_decoration">' +
								'<div id="client_output" class="client_decoration client_left"></div>' +
								'<div id="client_users" class="client_decoration client_right">' +
									'<div id="client_room" class="client_decoration ui-widget"><select id="client_rooms" class="client_rooms"></select><span class="name"></span> (<span class="online">0</span> users)</div>' +
									'<div id="client_room_users" class="client_decoration"></div>' +
								'</div>' +
								'<div id="client_input" class="client_decoration">' +
									'<button id="client_emoticons">😀</button><input id="client_command" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="160" /><button id="client_command_send">Send</button>' +
								'</div>' +
							'</div>';

			$body.append(chat_ui);

			net.console = $('#client_container');
			net.text_input = $('#client_command');
			net.text_input_button = $('#client_command_send');
			net.output_div = $('#client_output');
			net.client_room_users = $('#client_room_users');
			net.client_room = $('#client_room');
			net.client_rooms = $('#client_rooms');
			net.client_room_name = net.client_room.find('span.name');
			net.client_room_online = net.client_room.find('span.online');
			// noinspection JSUnresolvedFunction
			net.text_input.off('keypress').on('keypress', function (e) {
				// noinspection JSDeprecatedSymbols
				switch (e.which) {
					case 13:
						net.send_input();
						break;
					case 96:
						e.preventDefault();

						if (typeof window.top !== 'undefined') {
							if (typeof window.top['NETWORK_CONNECTION'] !== 'undefined') {
								if (typeof window.top['NETWORK_CONNECTION']['hide'] === 'function') {
									window.top['NETWORK_CONNECTION']['hide']();
								}
							}
						}
						break;
				}
			});
			// noinspection JSUnresolvedFunction
			net.text_input_button.off('click').on('click', function() {
				net.send_input();
			});

			// noinspection JSUnresolvedVariable
			if (typeof $.fn.selectmenu === 'function') {
				// noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
				net.client_rooms.selectmenu({
					change: function(e, ui) {
						// noinspection JSUnresolvedFunction
						net.send_cmd('join', ui.item.value);
					},
					open: function(e, ui) {
						// noinspection JSUnresolvedFunction
						net.send_cmd('list', {});
					}
				});
			}
		});
	});
} (this));