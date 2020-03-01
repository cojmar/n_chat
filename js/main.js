// noinspection ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols,DuplicatedCode
(function(global) {
	console.log('╔═╗╔╦╗╦ ╦╔═╗╔═╗╔╦═╗╦╔═╗\n' +
				'╠═ ║║║║ ║╠═╝╠═  ║ ║║╠═╣\n' +
				'╚═╝╩ ╩╚═╝╩  ╚═╝═╩═╝╩╩ ╩');

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
			emoticons: ['/beta/emuos/js/emoticons', '//emupedia.net/beta/emuos/js/emoticons', '//emuos.net/beta/emuos/js/emoticons'],
			fingerprint: ['/beta/emuos/js/libraries/fingerprint-0.5.3', '//emupedia.net/beta/emuos/js/libraries/fingerprint-0.5.3', '//emuos.net/beta/emuos/js/libraries/fingerprint-0.5.3'],
			ga: '//www.google-analytics.com/analytics',
			jquery: ['/beta/emuos/js/libraries/jquery-2.2.4.min', '//emupedia.net/beta/emuos/js/libraries/jquery-2.2.4.min', '//emuos.net/beta/emuos/js/libraries/jquery-2.2.4.min'],
			jquerymousewheel: ['/beta/emuos/js/libraries/jquery-mousewheel-3.1.13', '//emupedia.net/beta/emuos/js/libraries/jquery-mousewheel-3.1.13', '//emuos.net/beta/emuos/js/libraries/jquery-mousewheel-3.1.13'],
			jqueryui: ['/beta/emuos/js/libraries/jquery-ui-1.11.4.min', '//emupedia.net/beta/emuos/js/libraries/jquery-ui-1.11.4.min', '//emuos.net/beta/emuos/js/libraries/jquery-ui-1.11.4.min'],
			jqueryuicontextmenu: ['/beta/emuos/js/libraries/jquery-ui-contextmenu-1.18.1.min', '//emupedia.net/beta/emuos/js/libraries/jquery-ui-contextmenu-1.18.1.min', '//emuos.net/beta/emuos/js/libraries/jquery-ui-contextmenu-1.18.1.min'],
			jquerycustomscrollbar: ['/beta/emuos/js/libraries/jquery-customscrollbar-3.1.5.min', '//emupedia.net/beta/emuos/js/libraries/jquery-customscrollbar-3.1.5.min', '//emuos.net/beta/emuos/js/libraries/jquery-customscrollbar-3.1.5.min'],
			jqyeryajaxretry: ['/beta/emuos/js/libraries/jquery-ajax-retry-0.2.8.min', '//emupedia.net/beta/emuos/js/libraries/jquery-ajax-retry-0.2.8.min', '//emuos.net/beta/emuos/js/libraries/jquery-ajax-retry-0.2.8.min'],
			json: ['/beta/emuos/js/libraries/requirejs-json-1.0.3', '//emupedia.net/beta/emuos/js/libraries/requirejs-json-1.0.3', '//emuos.net/beta/emuos/js/libraries/requirejs-json-1.0.3'],
			moment: ['/beta/emuos/js/libraries/moment-2.24.0.min', '//emupedia.net/beta/emuos/js/libraries/moment-2.24.0.min', '//emuos.net/beta/emuos/js/libraries/moment-2.24.0.min'],
			'moment-timezone': ['/beta/emuos/js/libraries/moment-timezone-0.5.27.min', '//emupedia.net/beta/emuos/js/libraries/moment-timezone-0.5.27.min', '//emuos.net/beta/emuos/js/libraries/moment-timezone-0.5.27.min'],
			network: ['/beta/emuos/js/network', '//emupedia.net/beta/emuos/js/network', '//emuos.net/beta/emuos/js/network'],
			noext: ['/beta/emuos/js/libraries/requirejs-noext-1.0.3', '//emupedia.net/beta/emuos/js/libraries/requirejs-noext-1.0.3', '//emuos.net/beta/emuos/js/libraries/requirejs-noext-1.0.3'],
			simplestorage: ['/beta/emuos/js/libraries/simplestorage-0.2.1.min', '//emupedia.net/beta/emuos/js/libraries/simplestorage-0.2.1.min', '//emuos.net/beta/emuos/js/libraries/simplestorage-0.2.1.min'],
			socket: ['/beta/emuos/js/socket', '//emupedia.net/beta/emuos/js/socket', '//emuos.net/beta/emuos/js/socket'],
			socketio: ['/beta/emuos/js/libraries/socket.io-2.3.0.min', '//emupedia.net/beta/emuos/js/libraries/socket.io-2.3.0.min', '//emuos.net/beta/emuos/js/libraries/socket.io-2.3.0.min'],
			text: ['/beta/emuos/js/libraries/requirejs-text-2.0.15', '//emupedia.net/beta/emuos/js/libraries/requirejs-text-2.0.15', '//emuos.net/beta/emuos/js/libraries/requirejs-text-2.0.15'],
			twemoji: ['/beta/emuos/js/libraries/twemoji-12.1.5.min', '//emupedia.net/beta/emuos/js/libraries/twemoji-12.1.5.min', '//emuos.net/beta/emuos/js/libraries/twemoji-12.1.5.min']
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
		map: {}
	});

	// noinspection JSUnresolvedFunction
	requirejs([
		'jquery',
		'jqueryui',
		'json!../data/emoticons.json',
		'json!../data/normalize.json',
		'json!../data/blacklist.json',
		'emoticons',
		'twemoji',
		'simplestorage',
		'network',
		'jqyeryajaxretry',
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

			net.clean = function(str) {
				// noinspection JSUnresolvedFunction
				var subject = $('<div />').text(net.remove_zalgo(net.normalize(str))).html();

				if (~net.client_room_name.text().indexOf('Emupedia')) {
					subject = net.remove_profanity(net.remove_numbers(subject));
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
					subject = net.remove_profanity(subject);
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

				if (msg.trim().length <= 1) {
					return false;
				}

				// noinspection JSUnresolvedVariable
				if (net.last_msg) {
					if (net.last_msg === msg || ((~msg.indexOf(net.last_msg) || ~net.last_msg.indexOf(msg)) && msg.length >= 10)) {
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
					net.send_cmd(data.cmd, data.data);
				} else {
					// noinspection JSUnresolvedFunction
					net.send_cmd('room_msg', msg);
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
					if (~room.indexOf('Emupedia')) {
						if (net.room_info) {
							if (room === net.room_info.name) {
								// noinspection JSUnfilteredForInLoop
								html += '<option selected="selected" value="' + room + '" data-online="' + net.rooms[room] + '">' + room + ' (' + net.rooms[room] + ' online)</option>'
							} else {
								// noinspection JSUnfilteredForInLoop
								html += '<option value="' + room + '" data-online="' + net.rooms[room] + '">' + room + ' (' + net.rooms[room] + ' online)</option>'
							}
						} else {
							// noinspection JSUnfilteredForInLoop
							html += '<option value="' + room + '" data-online="' + net.rooms[room] + '">' + room + ' (' + net.rooms[room] + ' online)</option>'
						}
					}
				}

				// noinspection JSUnresolvedFunction
				net.client_rooms.html(html);

				if (typeof cb === 'function') {
					cb();
				}
			}

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('connect', function(data) {
				// console.log('connect');
				// console.log(JSON.stringify(data, null, 2));

				var server = typeof data !== 'undefined' ? data.server : net.server;
				// noinspection JSUnresolvedVariable
				var socket_id = typeof data !== 'undefined' ? data.socket_id : net.socket.id;

				// noinspection JSUnresolvedFunction
				net.relay('https://cloudflare.net/cdn-cgi/trace').done(function(data) {
					var lines = data.split('\n');
					var keyValue = '';
					var trace = [];

					lines.forEach(function(line) {
						keyValue = line.split('=');
						trace[keyValue[0]] = decodeURIComponent(keyValue[1] || '');

						if (keyValue[0] === 'loc') {
							switch (trace['loc']) {
								case 'AG':
								case 'AI':
								case 'AS':
								case 'AT':
								case 'AU':
								case 'BB':
								case 'BS':
								case 'BZ':
								case 'CA':
								case 'CY':
								case 'DK':
								case 'DM':
								case 'FI':
								case 'GB':
								case 'GD':
								case 'GI':
								case 'GU':
								case 'GY':
								case 'IE':
								case 'IL':
								case 'IM':
								case 'JA':
								case 'JM':
								case 'KN':
								case 'KY':
								case 'LC':
								case 'LR':
								case 'MH':
								case 'MP':
								case 'NR':
								case 'MT':
								case 'NL':
								case 'NZ':
								case 'PW':
								case 'RO':
								case 'SE':
								case 'SF':
								case 'SG':
								case 'SL':
								case 'SR':
								case 'TT':
								case 'UK':
								case 'US':
								case 'VC':
								case 'VG':
								case 'VI':
								case 'VU':
								case 'WL':
								case 'WG':
								case 'WS':
								case 'XX':
									// noinspection JSUnresolvedFunction
									simplestorage.deleteKey('country');
									break;
								default:
									simplestorage.set('country', trace['loc']);
									break;
							}
						}
					});
				}).always(function() {
					// noinspection JSUnresolvedFunction
					net.send_cmd('auth', {user: simplestorage.get('uid') ? simplestorage.get('uid') : '', room: 'Emupedia' + (simplestorage.get('country') ? '-' + simplestorage.get('country') : '')});
					net.rooms = {};
					net.chat_id = '<span style="color: #2c487e;">[' + socket_id + '] </span>';
					net.log('[connected][' + server + '] [id][' + socket_id + ']', 0, 0);
				});
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('disconnect', function() {
				// console.log('disconnect');
				// console.log(JSON.stringify(data, null, 2));
				net.log('[disconnected][' + net.server + ']', 0, 0);
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

				var r_users = '';

				// noinspection JSUnresolvedVariable
				for (var n in data.users) {
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					var color = (data.users[n].info.user !== data.me) ? net.colors[3] : net.colors[1];
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					r_users += '<div id="room_user_' + data.users[n].info.user + '" style="color: ' + color + '; word-break: keep-all;" title="' + data.users[n].info.user + '" data-title="' + data.users[n].info.user + '">' + net.clean_nicknames(data.users[n].info.nick) + '</div>';
				}

				// noinspection JSUnresolvedVariable,JSUnresolvedFunction
				net.text_input.attr('placeholder', 'Press "`" (tilda) to Show / Hide chat. You are Typing as "' + data.users[data.me].info.nick + '" on "' + data.name + '"');
				// noinspection JSUnresolvedFunction
				net.client_room_users.html(r_users);
				// noinspection JSUnresolvedFunction
				net.client_room_name.text(data.name);
				// noinspection JSUnresolvedVariable
				net.client_room_online.text(Object.keys(net.room_info.users).length);
				// noinspection JSUnresolvedVariable
				$('.ui-selectmenu-text').text(data.name + ' (' + Object.keys(net.room_info.users).length + ' online)');
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
					$('.ui-selectmenu-text').text(net.room_info.name + ' (' + Object.keys(net.room_info.users).length + ' online)');
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

				var nick = data.user;

				if (typeof net.room_info !== 'undefined') {
					// noinspection JSUnresolvedVariable
					if (typeof net.room_info.users[nick] !== 'undefined') {
						// noinspection JSUnresolvedVariable
						if (typeof net.room_info.users[nick].info !== 'undefined') {
							// noinspection JSUnresolvedVariable
							if (typeof net.room_info.users[nick].info.nick !== 'undefined') {
								// noinspection JSUnresolvedVariable
								nick = net.clean_nicknames(net.room_info.users[nick].info.nick);
							}
						}
					}
				}

				// noinspection JSUnresolvedVariable
				net.log('<span style="color: ' + net.colors[3] + '; overflow: hidden;">[' + nick + '] </span>' + net.clean(data.msg));
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
					}
				}
			});

			net.socket.on('rooms.list', function(data) {
				net.rooms = data;
				net.render_room_select(function() {
					// noinspection JSUnresolvedFunction
					$('#client_rooms-button').css('display', 'block');
					// noinspection JSUnresolvedFunction
					net.client_rooms.selectmenu('refresh');
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

			var network_ui = '<div id="client_container" class="client_decoration">' +
								'<div id="client_output" class="client_decoration client_left"></div>' +
								'<div id="client_users" class="client_decoration client_right">' +
									'<div id="client_room" class="client_decoration"><select id="client_rooms" class="client_rooms"></select><span class="name"></span> (<span class="online">0</span> online)</div>' +
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
				// noinspection JSUnresolvedFunction
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