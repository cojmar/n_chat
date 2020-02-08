// noinspection ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols,DuplicatedCode
(function(global) {
	console.log('╔═╗╔╦╗╦ ╦╔═╗╔═╗╔╦═╗╦╔═╗\n' +
				'╠═ ║║║║ ║╠═╝╠═  ║ ║║╠═╣\n' +
				'╚═╝╩ ╩╚═╝╩  ╚═╝═╩═╝╩╩ ╩');

	// noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
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
		paths: {
			emoticons: ['https://emupedia.net/beta/emuos/js/emoticons', 'https://emuos.net/beta/emuos/js/emoticons'],
			fingerprint: ['https://emupedia.net/beta/emuos/js/libraries/fingerprint-0.5.3', 'https://emuos.net/beta/emuos/js/libraries/fingerprint-0.5.3'],
			jquery: ['https://emupedia.net/beta/emuos/js/libraries/jquery-2.2.4.min', 'https://emuos.net/beta/emuos/js/libraries/jquery-2.2.4.min'],
			jquerymousewheel: ['https://emupedia.net/beta/emuos/js/libraries/jquery-mousewheel-3.1.13', 'https://emuos.net/beta/emuos/js/libraries/jquery-mousewheel-3.1.13'],
			jqueryui: ['https://emupedia.net/beta/emuos/js/libraries/jquery-ui-1.11.4.min', 'https://emuos.net/beta/emuos/js/libraries/jquery-ui-1.11.4.min'],
			jqueryuicontextmenu: ['https://emupedia.net/beta/emuos/js/libraries/jquery-ui-contextmenu-1.18.1.min', 'https://emuos.net/beta/emuos/js/libraries/jquery-ui-contextmenu-1.18.1.min'],
			jquerycustomscrollbar: ['https://emupedia.net/beta/emuos/js/libraries/jquery-customscrollbar-3.1.5.min', 'https://emuos.net/beta/emuos/js/libraries/jquery-customscrollbar-3.1.5.min'],
			jqyeryajaxretry: ['https://emupedia.net/beta/emuos/js/libraries/jquery-ajax-retry-0.2.8.min', 'https://emuos.net/beta/emuos/js/libraries/jquery-ajax-retry-0.2.8.min'],
			json: ['https://emupedia.net/beta/emuos/js/libraries/requirejs-json-1.0.3', 'https://emuos.net/beta/emuos/js/libraries/requirejs-json-1.0.3'],
			moment: ['https://emupedia.net/beta/emuos/js/libraries/moment-2.24.0.min', 'https://emuos.net/beta/emuos/js/libraries/moment-2.24.0.min'],
			'moment-timezone': ['https://emupedia.net/beta/emuos/js/libraries/moment-timezone-0.5.27.min', 'https://emuos.net/beta/emuos/js/libraries/moment-timezone-0.5.27.min'],
			network: ['https://emupedia.net/beta/emuos/js/network', 'https://emuos.net/beta/emuos/js/network'],
			noext: ['https://emupedia.net/beta/emuos/js/libraries/requirejs-noext-1.0.3', 'https://emuos.net/beta/emuos/js/libraries/requirejs-noext-1.0.3'],
			simplestorage: ['https://emupedia.net/beta/emuos/js/libraries/simplestorage-0.2.1.min', 'https://emuos.net/beta/emuos/js/libraries/simplestorage-0.2.1.min'],
			socketio: ['https://emupedia.net/beta/emuos/js/libraries/socket.io-2.3.0.min', 'https://emuos.net/beta/emuos/js/libraries/socket.io-2.3.0.min'],
			text: ['https://emupedia.net/beta/emuos/js/libraries/requirejs-text-2.0.15', 'https://emuos.net/beta/emuos/js/libraries/requirejs-text-2.0.15'],
			twemoji: ['https://emupedia.net/beta/emuos/js/libraries/twemoji-12.1.5.min', 'https://emuos.net/beta/emuos/js/libraries/twemoji-12.1.5.min']
		},
		shim: {
			chat: {
				deps: ['jquery', 'simplestorage', 'fingerprint', 'network']
			},
			fingerprint: {
				exports: 'Fingerprint'
			},
			jquerymousewheel: {
				deps: ['jquery']
			},
			jqueryui: {
				deps: ['jquery']
			},
			jqueryuicontextmenu: {
				deps: ['jqueryui']
			},
			jquerycustomscrollbar: {
				deps: ['jquerymousewheel']
			},
			network: {
				deps: ['socketio']
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
				io: 'socketio',
				'socket.io': 'socketio'
			}
		}
	});

	// noinspection JSUnresolvedFunction
	requirejs([
		'jquery',
		'json!../data/emoticons.json',
		'json!../data/diacritics.json',
		'json!../data/profanity.json',
		'emoticons',
		'twemoji',
		'simplestorage',
		'network',
		'fingerprint'
	], function($, emoticons_data, diacritics_data, profanity_data, emoticons, twemoji, simplestorage, network, Fingerprint) {
		$(function() {
			var $body = $('body');
			var net = network.start({
				servers: ['https://ws.emupedia.net/', 'https://ws.emuos.net/'],
				server: ~window.location.hostname.indexOf('emuos.net') ? 1 : 0,
				mode: 0
			});

			var fingerprint = new Fingerprint().get();
			fingerprint = typeof simplestorage.get('fingerprint') !== 'undefined' ? simplestorage.get('fingerprint') : simplestorage.set('fingerprint', fingerprint) && fingerprint;

			var search = Object.keys(emoticons_data.mapping);
			var replace = Object.values(emoticons_data.mapping);

			var search_regex = {};
			var replace_regex = {};

			// noinspection DuplicatedCode,JSUnresolvedVariable
			for (var profanity1 in profanity_data.mapping.en) {
				var regex1 = '';
				// noinspection JSUnfilteredForInLoop
				for (var p1 in profanity_data.mapping.en[profanity1]) {
					// noinspection JSUnfilteredForInLoop
					regex1 += ' ' + profanity_data.mapping.en[profanity1][p1] + '|';
					// noinspection JSUnfilteredForInLoop
					regex1 += ' ' + profanity_data.mapping.en[profanity1][p1] + ' |';
					// noinspection JSUnfilteredForInLoop
					regex1 += profanity_data.mapping.en[profanity1][p1] + ' |';
				}
				// noinspection JSUnfilteredForInLoop
				search_regex[profanity1] = new RegExp(regex1.slice(0, -1), 'gi');
			}

			// noinspection DuplicatedCode,JSUnresolvedVariable
			for (var profanity2 in profanity_data.replace.en) {
				// noinspection JSUnfilteredForInLoop
				var regex2 = profanity_data.replace.en[profanity2][0] + '|';
				// noinspection JSUnfilteredForInLoop,DuplicatedCode
				for (var p2 in profanity_data.replace.en[profanity2]) {
					// noinspection JSUnfilteredForInLoop
					regex2 += ' ' + profanity_data.replace.en[profanity2][p2] + '|';
					// noinspection JSUnfilteredForInLoop
					regex2 += ' ' + profanity_data.replace.en[profanity2][p2] + ' |';
					// noinspection JSUnfilteredForInLoop
					regex2 += profanity_data.replace.en[profanity2][p2] + ' |';
				}
				// noinspection JSUnfilteredForInLoop
				replace_regex[profanity2] = new RegExp(regex2.slice(0, -1), 'gi');
			}

			net.colors = ['rgba(180, 173, 173, 0.973)', '#395fa4', '#159904', 'rgba(128, 128, 128, 0.35)'];

			net.hash = function (str) {
				var hash = 5381, i = str.length;

				while (i) {
					hash = (hash * 33) ^ str.charCodeAt(--i);
				}

				return hash >>> 0;
			};

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

			net.str_ireplace = function(search, replace, subject, countObj) {
				var i = 0;
				var j = 0;
				var temp = '';
				var repl = '';
				// noinspection JSUnusedAssignment
				var sl = 0;
				var fl = 0;
				// noinspection JSUnusedAssignment
				var f = '';
				// noinspection JSUnusedAssignment
				var r = '';
				// noinspection JSUnusedAssignment
				var s = '';
				// noinspection JSUnusedAssignment
				var ra = '';
				var otemp = '';
				var oi = '';
				var ofjl = '';
				var os = subject;
				var osa = Object.prototype.toString.call(os) === '[object Array]';

				// noinspection DuplicatedCode
				if (typeof (search) === 'object') {
					temp = search;
					search = [];

					for (i = 0; i < temp.length; i += 1) {
						search[i] = temp[i].toLowerCase();
					}
				} else {
					search = search.toLowerCase();
				}

				// noinspection DuplicatedCode
				if (typeof (subject) === 'object') {
					temp = subject;
					subject = [];

					for (i = 0; i < temp.length; i += 1) {
						subject[i] = temp[i].toLowerCase();
					}
				} else {
					subject = subject.toLowerCase();
				}

				if (typeof (search) === 'object' && typeof (replace) === 'string') {
					temp = replace;
					replace = [];

					for (i = 0; i < search.length; i += 1) {
						replace[i] = temp;
					}
				}

				temp = '';
				f = [].concat(search);
				r = [].concat(replace);
				ra = Object.prototype.toString.call(r) === '[object Array]';
				s = subject;
				s = [].concat(s);
				os = [].concat(os);

				if (countObj) {
					countObj.value = 0;
				}

				for (i = 0, sl = s.length; i < sl; i++) {
					if (s[i] === '') {
						continue;
					}

					for (j = 0, fl = f.length; j < fl; j++) {
						temp = s[i] + '';
						repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
						s[i] = (temp).split(f[j]).join(repl);
						otemp = os[i] + '';
						oi = temp.indexOf(f[j]);
						ofjl = f[j].length;

						if (oi >= 0) {
							os[i] = (otemp).split(otemp.substr(oi, ofjl)).join(repl);
						}

						if (countObj) {
							countObj.value += ((temp.split(f[j])).length - 1);
						}
					}
				}

				return osa ? os : os[0];
			};

			net.remove_diacritics = function(str) {
				return str.replace(/[^\u0000-\u007E]/g, function (letter) {
					return diacritics_data.mapping[letter] || letter;
				});
			};

			net.remove_profanity = function(str) {
				for (var r1 in search_regex) {
					str = str.replace(search_regex[r1], ' ' + r1 + ' ');
				}

				for (var r2 in replace_regex) {
					str = str.replace(replace_regex[r2], ' `' + r2 + '` ');
				}

				return str.split('  ').join(' ').split('  ').join(' ');
			};

			net.normalize = function(str) {
				// noinspection JSUnresolvedFunction
				var subject = $('<div />').text(str.replace(/[0-9]/g, '').replace(/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F\u0483-\u0486\u05C7\u0610-\u061A\u0656-\u065F\u0670\u06D6-\u06ED\u0711\u0730-\u073F\u0743-\u074A\u0F18-\u0F19\u0F35\u0F37\u0F72-\u0F73\u0F7A-\u0F81\u0F84\u0e00-\u0eff\uFC5E-\uFC62]{2,}/gi, '')).html();

				if (net.client_room_name.text() === 'Emupedia') {
					subject = net.remove_profanity(net.remove_diacritics(subject));
				}

				return twemoji.parse(emoticons.parse(net.str_replace(search, replace, subject), {}, emoticons_data.emoticons.mapping), {
					folder: 'svg',
					ext: '.svg'
				});
			};

			net.normalize_nicknames = function(str) {
				var subject = $('<div />').text(str.replace(/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F\u0483-\u0486\u05C7\u0610-\u061A\u0656-\u065F\u0670\u06D6-\u06ED\u0711\u0730-\u073F\u0743-\u074A\u0F18-\u0F19\u0F35\u0F37\u0F72-\u0F73\u0F7A-\u0F81\u0F84\u0e00-\u0eff\uFC5E-\uFC62]{2,}/gi, '')).html();

				if (net.client_room_name.text() === 'Emupedia') {
					subject = net.remove_profanity(net.remove_diacritics(subject));
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

				var msg_class = typeof hide !== 'undefined' ? 'net_msg_hide' : 'net_msg';

				net.output_div.append('<div class="'+ msg_class +'" style="' + color + '">' + time_stamp + txt + '</div>');

				setTimeout(function() {
					// noinspection JSUnresolvedFunction
					$('.net_msg_hide').slideUp(200, function() {
						$(this).remove();
					});
				}, hide ? hide : 0);

				net.output_div.get(0).scrollTop = net.output_div.get(0).scrollHeight;
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

				// noinspection JSUnresolvedVariable
				if (net.last_msg) {
					if (net.last_msg === msg || (~msg.indexOf(net.last_msg) && msg.length >= 10)) {
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

					// noinspection JSUnresolvedFunction
					net.send_cmd(data.cmd, data.data);
				} else {
					// noinspection JSUnresolvedFunction
					net.send_cmd('room_msg', msg);
					net.last_msg = msg;
				}

				// noinspection JSUnresolvedFunction
				net.text_input.val('');
			};

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('connect', function(data) {
				// console.log('connect');
				// console.log(JSON.stringify(data, null, 2));

				var server = typeof data !== 'undefined' ? data.server : net.server;
				// noinspection JSUnresolvedVariable
				var socket_id = typeof data !== 'undefined' ? data.socket_id : net.socket.id;
				// noinspection JSUnresolvedFunction
				net.send_cmd('auth', {user: 'EMU-' + fingerprint, room: 'Emupedia'});
				net.chat_id = '<span style="color: #2c487e;">[' + socket_id + '] </span>';
				net.log('[connected][' + server + '] [id][' + socket_id + ']', 0);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('disconnect', function() {
				// console.log('disconnect');
				// console.log(JSON.stringify(data, null, 2));
				net.log('[disconnected][' + net.server + ']', 0);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('auth.info', function (data) {
				// console.log('auth.info');
				// console.log(JSON.stringify(data, null, 2));

				// noinspection JSUnresolvedVariable
				if (data.login === data.info.nick) {
					net.log('Type /nick <nickname> to set your name', 0);
				}
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.info', function (data) {
				// console.log('room.info');
				// console.log(JSON.stringify(data, null, 2));

				net.room_info = data;

				var r_users = '';

				// noinspection JSUnresolvedVariable
				for (var n in data.users) {
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					var color = (data.users[n].info.user !== data.me) ? net.colors[3] : net.colors[1];
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					r_users += '<div id="room_user_' + net.hash(data.users[n].info.user) + '" style="color: ' + color + '; word-break: keep-all;" title="' + data.users[n].info.user + '" data-title="' + data.users[n].info.user + '">' + net.normalize_nicknames(data.users[n].info.nick) + '</div>';
				}

				// noinspection JSUnresolvedVariable,JSUnresolvedFunction
				net.text_input.attr('placeholder', 'Press "`" (tilda) to Show / Hide chat. You are Typing as "' + data.users[data.me].info.nick + '" on "' + data.name + '"');
				// noinspection JSUnresolvedFunction
				net.client_room_users.html(r_users);
				// noinspection JSUnresolvedFunction
				net.client_room_name.text(data.name);
				// noinspection JSUnresolvedVariable
				net.client_room_online.text(Object.keys(net.room_info.users).length)
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.user_join', function (data) {
				// console.log('room.user_join');
				// console.log(JSON.stringify(data, null, 2));

				if (net.room_info) {
					// noinspection JSUnresolvedVariable
					net.room_info.users[data.user] = data.data;
					// noinspection JSUnresolvedVariable
					net.client_room_online.text(parseInt(net.client_room_online.text()) + 1);
				}
				// noinspection JSUnresolvedVariable
				net.client_room_users.append('<div id="room_user_' + net.hash(data.data.info.user) + '" style="color: ' + net.colors[3] + '; word-break: keep-all;" title="' + data.data.info.user + '" data-title="' + data.data.info.user + '">' + net.normalize_nicknames(data.data.info.nick) + '</div>');
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.user_leave', function (data) {
				// console.log('room.user_leave');
				// console.log(JSON.stringify(data, null, 2));

				var $el = $('#room_user_' + net.hash(data.user));
				net.client_room_online.text(parseInt(net.client_room_online.text()) - 1);

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

				var nick = data.user;

				if (typeof net.room_info !== 'undefined') {
					// noinspection JSUnresolvedVariable
					if (typeof net.room_info.users[nick] !== 'undefined') {
						// noinspection JSUnresolvedVariable
						if (typeof net.room_info.users[nick].info !== 'undefined') {
							// noinspection JSUnresolvedVariable
							if (typeof net.room_info.users[nick].info.nick !== 'undefined') {
								// noinspection JSUnresolvedVariable
								nick = net.normalize_nicknames(net.room_info.users[nick].info.nick);
							}
						}
					}
				}

				// noinspection JSUnresolvedVariable
				net.log('<span style="color: ' + net.colors[3] + '; overflow: hidden;">[' + nick + '] </span>' + net.normalize(data.msg));
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.user_info',function(data) {
				// console.log('room.user_info');
				// console.log(JSON.stringify(data, null, 2));

				// noinspection JSUnresolvedVariable
				if (net.room_info.users[data.user]) {
					for (var n in data.info) {
						// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
						net.room_info.users[data.user].info[n] = data.info[n];
					}

					// noinspection JSUnresolvedVariable
					if (data.info.nick) {
						// noinspection JSUnresolvedVariable,JSUnresolvedFunction
						$('#room_user_' + net.hash(data.user)).attr('data-title', data.user).data('title', data.user).html(net.normalize_nicknames(data.info.nick));
					}
				}
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			/*net.socket.on('silent.msg', function (data) {
				// console.log('silent.msg');
				// console.log(JSON.stringify(data, null, 2));

				//net.log(net.normalize(data), 1, 10000);
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

			var network_ui = '<div id="client_container" class="client_decoration">' +
								'<div id="client_output" class="client_decoration client_left"></div>' +
								'<div id="client_users" class="client_decoration client_right">' +
									'<div id="client_room" class="client_decoration"><span class="name"></span> (<span class="online">0</span> online)</div>' +
									'<div id="client_room_users" class="client_decoration"></div>' +
								'</div>' +
								'<div id="client_input" class="client_decoration">' +
									'<button id="client_emoticons">😀</button><input id="client_command" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="160" /><button id="client_command_send">Send</button>' +
								'</div>' +
							'</div>';

			$body.append(network_ui);

			net.console = $('#client_container');
			net.text_input = $('#client_command');
			net.text_input_button = $('#client_command_send');
			net.output_div = $('#client_output');
			net.client_room_users = $('#client_room_users');
			net.client_room = $('#client_room');
			net.client_room_name = net.client_room.find('span.name');
			net.client_room_online = net.client_room.find('span.online');
			// noinspection JSUnresolvedFunction
			net.text_input.off('keypress').on('keypress', function (e) {
				// noinspection JSDeprecatedSymbols
				if (e.which === 13) {
					net.send_input();
				}
			});
			// noinspection JSUnresolvedFunction
			net.text_input_button.off('click').on('click', function() {
				net.send_input();
			});
		});
	});
} (this));