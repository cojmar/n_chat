// noinspection ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols,DuplicatedCode
(function(global) {
	/*console.log('╔═╗╔╦╗╦ ╦╔═╗╦ ╦╔═╗╔╦╗\n' +
				  '╠═ ║║║║ ║║  ╠═╣╠═╣ ║ \n' +
				  '╚═╝╩ ╩╚═╝╚═╝╩ ╩╩ ╩ ╩ ');*/

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

	window.__ga__.q = [
		['create', 'UA-47896346-6', 'auto']
	];

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
						define(failedId, [], function() { return {}; });
					break;
				}

				req([failedId], onLoadSuccess);
			};

			req([name], onLoadSuccess, onLoadFailure);
		},
		normalize: function(name, normalize) {
			return normalize(name);
		}
	});

	// noinspection JSUnresolvedFunction,JSUnresolvedVariable
	requirejs.config({
		urlArgs: 'rand=' + (new Date()).getTime(),
		waitSeconds: 300,
		paths: $sys.lib,
		shim: {
			bson: {
				exports: 'BSON'
			},
			chat: {
				deps: ['jquery', 'simplestorage', 'fingerprint', 'network']
			},
			fingerprint: {
				exports: 'Fingerprint'
			},
			'jquery-mousewheel': {
				deps: ['jquery']
			},
			'spectrum': {
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
			popper: {
				exports: 'Popper'
			},
			socket: {
				deps: ['bson']
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

	// noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
	requirejs([
		'jquery',
		'jquery-ui',
		'json!../data/emoticons.json',
		'json!../data/normalize.json',
		'json!../data/blacklist.json',
		'json!../data/adjectives.json',
		'json!../data/animals.json',
		'json!../data/colors.json',
		'json!../data/country_codes.json',
		'json!../data/events.json',
		'emoticons',
		'twemoji',
		'seedrandom',
		'simplestorage',
		'emoji-button',
		'network',
		'jquery-ajax-retry',
		'popper',
		'optional!ga',
		'libraries/spectrum'
	], function($, jqueryui, emoticons_data, normalize_data, blacklist_data, adjectives, animals, colors, country_codes, events, emoticons, twemoji, seedrandom, simplestorage, EmojiButton, network, ajaxretry, Popper, ga, spectrum) {
		// noinspection DuplicatedCode
		$(function() {
			if (typeof ga === 'function') {
				ga('send', {
					hitType: 'pageview',
					page: window.location.pathname,
					title: window.location.href
				});
			}

			var servers = ['wss://ws.emupedia.net/ws/', 'wss://ws.emupedia.net/ws/', 'wss://ws.emupedia.org/ws/', 'wss://ws.emupedia.org/ws/', 'wss://ws.emuos.net/ws/', 'wss://ws.emuos.net/ws/', 'wss://ws.emuos.org/ws/', 'wss://ws.emuos.org/ws/', 'ws://cojmar.ddns.net/ws/'];
			var domains = ['emupedia.net', 'emuchat.emupedia.net', 'emupedia.org', 'emuchat.emupedia.org', 'emuos.net', 'emuchat.emuos.net', 'emuos.org', 'emuchat.emuos.org', 'cojmar.ddns.net'];
			var normalize_types = ['wide', 'bold-serif-numbers-only', 'bold-sans-numbers-only', 'cursive-numbers-only', 'double-stroke-numbers-only', 'circles', 'circles-bold-numbers-only', 'inverted-circles', 'squares', 'inverted-squares', 'dotted-numbers-only', 'parenthesis-numbers-only', 'subscript', 'superscript', 'upsidedown-numbers-only', 'uncategorized', 'diacritics'];

			var net = network.start({
				servers: servers,
				server: ~domains.indexOf(window.location.hostname) ? domains.indexOf(window.location.hostname) : 0,
				mode: 0
			});

			var picker = new EmojiButton({
				theme: 'dark',
				style: 'twemoji',
				position: 'bottom',
				emojiSize: '1.2em',
				emojisPerRow: 6,
				rows: 5
			});

			var emoticons_search = Object.keys(emoticons_data.mapping);
			var emoticons_replace = Object.values(emoticons_data.mapping);
			var normalize = Object.keys(normalize_data.mapping);

			var blacklist_search_regex = {};
			var blacklist_search_regex_tr = {};
			var blacklist_search_regex_pt = {};
			var blacklist_replace_regex = {};

			// noinspection JSUnresolvedVariable,DuplicatedCode
			for (var profanity1 in blacklist_data.mapping.en) {
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var regex1 = blacklist_data.mapping.en[profanity1][0] + '|';
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var profanity1sorted = blacklist_data.mapping.en[profanity1].sort(function(a, b) {
					return b.length - a.length;
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
				blacklist_search_regex[profanity1] = new RegExp(regex1.slice(0, -1), 'gi');
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
				blacklist_replace_regex[profanity2] = new RegExp(regex2.slice(0, -1), 'gi');
			}

			// noinspection JSUnresolvedVariable,DuplicatedCode
			for (var profanity3 in blacklist_data.mapping.tr) {
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var regex3 = blacklist_data.mapping.tr[profanity3][0] + '|';
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var profanity3sorted = blacklist_data.mapping.tr[profanity3].sort(function(a, b) {
					return b.length - a.length;
				});
				// noinspection JSUnfilteredForInLoop
				for (var p3 in profanity3sorted) {
					// noinspection JSUnfilteredForInLoop
					regex3 += ' ' + profanity3sorted[p3] + '|';
					// noinspection JSUnfilteredForInLoop
					regex3 += ' ' + profanity3sorted[p3] + ' |';
					// noinspection JSUnfilteredForInLoop
					regex3 += profanity3sorted[p3] + ' |';
				}
				// noinspection JSUnfilteredForInLoop
				blacklist_search_regex_tr[profanity3] = new RegExp(regex3.slice(0, -1), 'gi');
			}

			// noinspection JSUnresolvedVariable,DuplicatedCode
			for (var profanity4 in blacklist_data.mapping.pt) {
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var regex4 = blacklist_data.mapping.pt[profanity4][0] + '|';
				// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
				var profanity4sorted = blacklist_data.mapping.pt[profanity4].sort(function(a, b) {
					return b.length - a.length;
				});
				// noinspection JSUnfilteredForInLoop
				for (var p4 in profanity4sorted) {
					// noinspection JSUnfilteredForInLoop
					regex4 += ' ' + profanity4sorted[p4] + '|';
					// noinspection JSUnfilteredForInLoop
					regex4 += ' ' + profanity4sorted[p4] + ' |';
					// noinspection JSUnfilteredForInLoop
					regex4 += profanity4sorted[p4] + ' |';
				}
				// noinspection JSUnfilteredForInLoop
				blacklist_search_regex_pt[profanity4] = new RegExp(regex4.slice(0, -1), 'gi');
			}

			net.event_timeout = null;
			net.colors = ['#b4adad', '#395fa4', '#159904', '#4c4c4c', '#e1c532', '#79667d'];
			net.chat_buffer = [];
			net.spam_buffer = [];
			net.disabled_commands = ['connect', 'disconnect', 'auth', 'my_info', 'list', 'leave', 'room_msg', 'room_data', 'room_info', 'room_users', 'set_data','set_room_data'];
			net.lock_scroll = true;
			net.show_flags = false;
			net.max_message_length = 160;
			net.max_paste_length = 60;

			net.use_blacklist = simplestorage.get('use_blacklist');
			net.use_events = simplestorage.get('use_events');
			net.use_animated_topic = simplestorage.get('use_animated_topic');
			net.use_animated_emoticons = simplestorage.get('use_animated_emoticons');
			net.refresh_users = simplestorage.get('refresh_users');
			net.use_colors = simplestorage.get('use_colors');

			if (typeof net.use_blacklist === 'undefined') {
				simplestorage.set('use_blacklist', true);
				net.use_blacklist = true;
			}

			if (typeof net.use_events === 'undefined') {
				simplestorage.set('use_events', true);
				net.use_events = true;
			}

			if (typeof net.use_animated_topic === 'undefined') {
				simplestorage.set('use_animated_topic', true);
				net.use_animated_topic = true;
			}

			if (typeof net.use_animated_emoticons === 'undefined') {
				simplestorage.set('use_animated_emoticons', true);
				net.use_animated_emoticons = true;
			}

			if (typeof net.refresh_users === 'undefined') {
				simplestorage.set('refresh_users', true);
				net.refresh_users = true;
			}

			if (typeof net.use_colors === 'undefined') {
				simplestorage.set('use_colors', true);
				net.use_colors = true;
			}

			if (window.top) {
				try {
					if (window.top.u_network) {
						if (!window.top.u_network.frames) {
							window.top.u_network.frames = [];
						}

						if (!window.top.u_network.reload) {
							window.top.u_network.reload = function() {
								window.top.u_network.frames.map(function(win) {
									if (win && win.location) {
										win.location.reload();
									}
								})
							}
						}

						window.top.u_network.frames.push(window);
					}
				} catch (error) {}
			}

			net.is_admin = function(user) {
				if (typeof user === 'undefined') {
					if (typeof net.room_info !== 'undefined') {
						if (typeof net.room_info.data !== 'undefined' && typeof net.room_info.me !== 'undefined') {
							if (typeof net.room_info.data.admins !== 'undefined') {
								if (Array.isArray(net.room_info.data.admins)) {
									if (~net.room_info.data.admins.indexOf(net.room_info.me)) {
										return true;
									}
								}
							}
						}
					}
				} else {
					if (typeof net.room_info !== 'undefined') {
						if (typeof net.room_info.data !== 'undefined') {
							if (typeof net.room_info.data.admins !== 'undefined') {
								if (Array.isArray(net.room_info.data.admins)) {
									if (~net.room_info.data.admins.indexOf(user)) {
										return true;
									}
								}
							}
						}
					}
				}

				return false;
			};

			net.increase_brightness = function(hex, percent) {
				hex = hex.replace(/^\s*#|\s*$/g, '');

				if (hex.length === 3) {
					hex = hex.replace(/(.)/g, '$1$1');
				}

				var r = parseInt(hex.substr(0, 2), 16),
					g = parseInt(hex.substr(2, 2), 16),
					b = parseInt(hex.substr(4, 2), 16);

				return '#' + ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) + ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) + ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
			};

			net.random_integer = function(rand, min, max) {
				return Math.floor(rand * (max - min + 1) + min)
			};

			net.random_pickone = function(rand, arr) {
				return arr[net.random_integer(rand, 0, arr.length - 1)]
			};

			net.is_default_nick = function(nick) {
				return !isNaN(parseInt(nick)) && nick.indexOf('-') === 10;
			};

			net.friendly_name = function(seed) {
				var rand = seedrandom(seed);

				// noinspection JSUnresolvedFunction
				var adjective = net.random_pickone(rand(), adjectives);
				// noinspection JSUnresolvedFunction
				var color = net.random_pickone(rand(), colors);
				// noinspection JSUnresolvedFunction
				var animal = net.random_pickone(rand(), animals);
				var name = color + ' ' + adjective + ' ' + animal;

				return name.toLowerCase().split(' ').map(function(word) {
					return word.charAt(0).toUpperCase() + word.slice(1);
				}).join(' ');
			};

			net.str_replace = function(search, replace, subject, countObj) {
				var i = 0;
				var j = 0;
				var temp = '';
				var repl = '';
				// noinspection JSUnusedAssignment
				var sl = 0;
				var fl = 0;
				var f = [].concat(search);
				var r = [].concat(replace);
				var s = subject;
				var ra = Object.prototype.toString.call(r) === '[object Array]';
				var sa = Object.prototype.toString.call(s) === '[object Array]';
				s = [].concat(s);

				if (typeof search === 'object' && typeof replace === 'string') {
					temp = replace;
					replace = [];

					for (i = 0; i < search.length; i += 1) {
						replace[i] = temp;
					}

					temp = '';
					r = [].concat(replace);
					ra = Object.prototype.toString.call(r) === '[object Array]';
				}

				if (typeof countObj !== 'undefined') {
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

						if (typeof countObj !== 'undefined') {
							countObj.value += ((temp.split(f[j])).length - 1);
						}
					}
				}
				return sa ? s : s[0];
			};

			net.normalize = function(str, type) {
				var arr = Array.from(str);

				for (var i in arr) {
					for (var j in normalize) {
						if (typeof type !== 'undefined') {
							if (Array.isArray(type)) {
								for (var k in type) {
									// noinspection JSUnfilteredForInLoop
									if (normalize[j] === type[k]) {
										// noinspection JSUnfilteredForInLoop
										if (typeof normalize_data.mapping[normalize[j]][arr[i]] !== 'undefined') {
											// noinspection JSUnfilteredForInLoop
											arr[i] = normalize_data.mapping[normalize[j]][arr[i]];
										}
									}
								}
							} else if (normalize[j] === type) {
								// noinspection JSUnfilteredForInLoop
								if (typeof normalize_data.mapping[normalize[j]][arr[i]] !== 'undefined') {
									// noinspection JSUnfilteredForInLoop
									arr[i] = normalize_data.mapping[normalize[j]][arr[i]];
								}
							}
						} else {
							// noinspection JSUnfilteredForInLoop
							if (typeof normalize_data.mapping[normalize[j]][arr[i]] !== 'undefined') {
								// noinspection JSUnfilteredForInLoop
								arr[i] = normalize_data.mapping[normalize[j]][arr[i]];
							}
						}
					}
				}

				return arr.join('');
			};

			// noinspection DuplicatedCode
			net.get_user_level = function(user_id) {
				var timeRequired = '∞';

				var def_ret = {
					curLevel: 0,
					pointsRequired: 0,
					timeRequired: timeRequired,
					pointsNextLevel: 0,
					xp: 0
				};

				if (!net.room_info) {
					return def_ret;
				}

				// noinspection JSUnresolvedVariable
				var room_user = net.room_info.users[user_id] || false;

				if (!room_user) {
					return def_ret;
				}

				// noinspection JSUnresolvedVariable
				var XP = room_user && room_user.info ? room_user.info.online_time + Math.floor((Date.now() - Date.parse(room_user.info.last_login_date)) / 1000) : 1;
				var div = 50;
				var curPoints = (XP <= 0 ? 1 : XP) / div;
				var curLevel = Math.floor(.25 * Math.sqrt(curPoints)) + 1;
				var pointsNextLevel = Math.pow((curLevel + 1) * 4, 2);
				var pointsRequired = pointsNextLevel - curPoints;

				try {
					timeRequired = new Date((pointsRequired * div) * 1000).toISOString().substr(11, 8);
				} catch (e) {
					timeRequired = '∞';
				}

				return {
					curLevel: curLevel,
					pointsRequired: pointsRequired,
					timeRequired: timeRequired,
					pointsNextLevel: pointsNextLevel,
					xp: XP
				}
			};

			net.romanize = function(num) {
				if (isNaN(num))
					return NaN;

				var digits = String(+num).split(''),
					key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
					roman = '',
					i = 3;

				while (i--)
					roman = (key[+digits.pop() + (i * 10)] || '') + roman;

				return Array(+digits.join('') + 1).join('M') + roman;
			};

			net.htmlentities = function(str) {
				return str.replace(/[\u00A0-\u9999<>&]/g, function(i) {
					return '&#' + i.charCodeAt(0) + ';';
				});
			};

			net.country_code_emoji = function(cc) {
				if (/^[a-z]{2}$/i.test(cc)) {
					var code_points = cc.toUpperCase().split('');

					var result = code_points.map(function(c) {
						return c.codePointAt() + 127397;
					});

					result = result.map(function(c) {
						return String.fromCodePoint(c);
					});

					return result.join('');
				}

				return cc;
			};

			net.remove_invisible_before = function(str) {
				return str.replace(/[\u0009\u000a\u000c\u000d\u007f\u00a0\u00ad\u034f\u061a\u061c\u064b\u115f\u1160\u17b4\u17b5\u180e\u2000-\u200c\u200e\u200f\u202a-\u202f\u205f-\u206f\u20d0-\u20f0\u2800\u3000\u3164\ufe00-\ufe0e\ufeff\uffa0\ufff0-\ufff8\ufffd]/g, '').replace(/\udb40\udc20/g, '').replace(/\udb40\udc21/g, '').replace(/\udb40\udc22/g, '').replace(/\udb40\udc23/g, '').replace(/\udb40\udc24/g, '').replace(/\udb40\udc25/g, '').replace(/\udb40\udc26/g, '').replace(/\udb40\udc27/g, '').replace(/\udb40\udc28/g, '').replace(/\udb40\udc29/g, '').replace(/\udb40\udc2a/g, '').replace(/\udb40\udc2c/g, '').replace(/\udb40\udc2d/g, '').replace(/\udb40\udc2e/g, '').replace(/\udb40\udc2f/g, '').replace(/\udb40\udc30/g, '').replace(/\udb40\udc31/g, '').replace(/\udb40\udc32/g, '').replace(/\udb40\udc33/g, '').replace(/\udb40\udc34/g, '').replace(/\udb40\udc35/g, '').replace(/\udb40\udc36/g, '').replace(/\udb40\udc37/g, '').replace(/\udb40\udc38/g, '').replace(/\udb40\udc39/g, '').replace(/\udb40\udc3a/g, '').replace(/\udb40\udc3b/g, '').replace(/\udb40\udc3c/g, '').replace(/\udb40\udc3d/g, '').replace(/\udb40\udc3e/g, '').replace(/\udb40\udc3f/g, '').replace(/\udb40\udc40/g, '').replace(/\udb40\udc41/g, '').replace(/\udb40\udc42/g, '').replace(/\udb40\udc43/g, '').replace(/\udb40\udc44/g, '').replace(/\udb40\udc45/g, '').replace(/\udb40\udc46/g, '').replace(/\udb40\udc47/g, '').replace(/\udb40\udc48/g, '').replace(/\udb40\udc49/g, '').replace(/\udb40\udc4a/g, '').replace(/\udb40\udc4b/g, '').replace(/\udb40\udc4c/g, '').replace(/\udb40\udc4d/g, '').replace(/\udb40\udc4e/g, '').replace(/\udb40\udc4f/g, '').replace(/\udb40\udc50/g, '').replace(/\udb40\udc51/g, '').replace(/\udb40\udc52/g, '').replace(/\udb40\udc53/g, '').replace(/\udb40\udc54/g, '').replace(/\udb40\udc55/g, '').replace(/\udb40\udc56/g, '').replace(/\udb40\udc57/g, '').replace(/\udb40\udc58/g, '').replace(/\udb40\udc59/g, '').replace(/\udb40\udc5a/g, '').replace(/\udb40\udc5c/g, '').replace(/\udb40\udc5d/g, '').replace(/\udb40\udc5e/g, '').replace(/\udb40\udc5f/g, '').replace(/\udb40\udc60/g, '').replace(/\udb40\udc61/g, '').replace(/\udb40\udc62/g, '').replace(/\udb40\udc63/g, '').replace(/\udb40\udc64/g, '').replace(/\udb40\udc65/g, '').replace(/\udb40\udc66/g, '').replace(/\udb40\udc67/g, '').replace(/\udb40\udc68/g, '').replace(/\udb40\udc69/g, '').replace(/\udb40\udc6a/g, '').replace(/\udb40\udc6b/g, '').replace(/\udb40\udc6c/g, '').replace(/\udb40\udc6d/g, '').replace(/\udb40\udc6e/g, '').replace(/\udb40\udc6f/g, '').replace(/\udb40\udc70/g, '').replace(/\udb40\udc71/g, '').replace(/\udb40\udc72/g, '').replace(/\udb40\udc73/g, '').replace(/\udb40\udc74/g, '').replace(/\udb40\udc75/g, '').replace(/\udb40\udc76/g, '').replace(/\udb40\udc77/g, '').replace(/\udb40\udc78/g, '').replace(/\udb40\udc79/g, '').replace(/\udb40\udc7a/g, '').replace(/\udb40\udc7b/g, '').replace(/\udb40\udc7d/g, '').replace(/\udb40\udc7e/g, '').replace(/\udb40\udc7f/g, '').replace(/\ud834\udd73/g, '').replace(/\ud834\udd74/g, '').replace(/\ud834\udd75/g, '').replace(/\ud834\udd76/g, '').replace(/\ud834\udd77/g, '').replace(/\ud834\udd78/g, '').replace(/\ud834\udd79/g, '').replace(/\ud834\udd7a/g, '').replace(/&lrm;/gi, '').replace(/&rlm;/gi, '').replace(/&ZeroWidthSpace;/gi, '').replace(/&zwj;/gi, '').replace(/&zwnj;/gi, '').replace(/&nbsp;/gi, '');
			};

			net.remove_invisible_after = function(str) {
				return str.replace(/[\u200d\ufe0f]/g, '');
			};

			net.remove_combining = function(str) {
				return str.replace(/[\u0336\u0337\u0489\u064d\u0650\u065c\u065e\u20d8\ufc5e]/g, '').replace(/\u064d\u0650/g, '');
			};

			net.remove_numbers = function(str) {
				return str.replace(/[0-9]/g, '').replace(/\ud83d\udd1f/g, '');
			};

			net.remove_duplicates = function(str) {
				return str.replace(/(.)\1{2,}/gi, '$1');
			};

			net.remove_zalgo = function(str) {
				return str.replace(/[\u0300-\u036F\u0483-\u0486]/g, '').replace(/[\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F\u0483-\u0486\u05C7\u0610-\u061A\u0656-\u065F\u0670\u06D6-\u06ED\u0711\u0730-\u073F\u0743-\u074A\u0F18-\u0F19\u0F35\u0F37\u0F72-\u0F73\u0F7A-\u0F81\u0F84\u0e00-\u0eff\uFC5E-\uFC62]{2,}/gi, '');
			};

			// noinspection DuplicatedCode
			net.has_profanity = function(str, language) {
				var room_name = net.room_info.name || '';

				if (typeof language === 'undefined') {
					language = room_name.startsWith('Emupedia-') ? net.room_info.name.replace('Emupedia-', '').toLowerCase() : 'en';
				}

				if (language === null || language === '' || language === 'emupedia') {
					language = 'en';
				} else if (language === 'br') {
					language = 'pt';
				} else if (language !== 'en' && language !== 'tr' && language !== 'br' && language !== 'pt') {
					language = 'en';
				}

				str = net.remove_combining(net.remove_invisible_before(str));
				str = str.replace(/  +/g, ' ').trim();

				if (!net.use_blacklist) {
					return false;
				}

				// noinspection JSUnresolvedVariable
				for (var profanity1 in blacklist_data.mapping[language]) {
					// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
					var profanity1sorted = blacklist_data.mapping[language][profanity1].sort(function(a, b) {
						return b.length - a.length
					});

					for (var p1 in profanity1sorted) {
						// noinspection JSUnfilteredForInLoop
						if (str.toLowerCase().split('?').join('').split('!').join('') === profanity1sorted[p1].split('.').join(' ').split('\\$').join('$').trim()) {
							str = profanity1;

							// noinspection JSUnresolvedVariable
							for (var profanity2 in blacklist_data.replace[language]) {
								// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
								for (var p2 in blacklist_data.replace[language][profanity2]) {
									// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
									if (str.toLowerCase() === blacklist_data.replace[languge][profanity2][p2]) {
										return true;
									}
								}
							}
						}
					}
				}

				if (language === 'en') {
					for (var r1 in blacklist_search_regex) {
						if (str.match(blacklist_search_regex[r1])) {
							return true;
						}
					}
				} else if (language === 'tr') {
					for (var r2 in blacklist_search_regex_tr) {
						if (str.match(blacklist_search_regex_tr[r2])) {
							return true;
						}
					}
				} else if (language === 'pt') {
					for (var r3 in blacklist_search_regex_pt) {
						if (str.match(blacklist_search_regex_pt[r3])) {
							return true;
						}
					}
				}

				return false;
			};

			// noinspection DuplicatedCode
			net.remove_profanity = function(str, language) {
				var room_name = net.room_info.name || '';

				if (typeof language === 'undefined') {
					language = room_name.startsWith('Emupedia-') ? net.room_info.name.replace('Emupedia-', '').toLowerCase() : 'en';
				}

				if (language === null || language === '' || language === 'emupedia') {
					language = 'en';
				} else if (language === 'br') {
					language = 'pt';
				} else if (language !== 'en' && language !== 'tr' && language !== 'br' && language !== 'pt') {
					language = 'en';
				}

				str = net.remove_combining(net.remove_invisible_before(str));
				str = str.replace(/  +/g, ' ').trim();

				if (net.use_blacklist) {
					// noinspection JSUnresolvedVariable
					for (var profanity1 in blacklist_data.mapping[language]) {
						// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
						var profanity1sorted = blacklist_data.mapping[language][profanity1].sort(function(a, b) {
							return b.length - a.length
						});

						for (var p1 in profanity1sorted) {
							// noinspection JSUnfilteredForInLoop
							if (str.toLowerCase().split('?').join('').split('!').join('') === profanity1sorted[p1].split('.').join(' ').split('\\$').join('$').trim()) {
								// noinspection JSUnfilteredForInLoop
								str = language === 'en' ? profanity1 : '``';

								// noinspection JSUnresolvedVariable
								for (var profanity2 in blacklist_data.replace[language]) {
									// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
									for (var p2 in blacklist_data.replace[language][profanity2]) {
										// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
										if (str.toLowerCase() === blacklist_data.replace[language][profanity2][p2]) {
											// noinspection JSUnfilteredForInLoop
											return str = '`' + (language === 'en' ? profanity2 : '') + '`';
										}
									}
								}
							}
						}
					}

					if (language === 'en') {
						for (var r1 in blacklist_search_regex) {
							str = str.replace(blacklist_search_regex[r1], ' ' + r1 + ' ');
						}

						for (var r2 in blacklist_replace_regex) {
							str = str.replace(blacklist_replace_regex[r2], ' `' + r2 + '` ');
						}
					}
				}

				return str.replace(/  +/g, ' ').trim();
			};

			// noinspection DuplicatedCode
			net.remove_spam = function(str, language) {
				var room_name = net.room_info.name || '';

				if (typeof language === 'undefined') {
					language = room_name.startsWith('Emupedia-') ? net.room_info.name.replace('Emupedia-', '').toLowerCase() : 'en';
				}

				if (language === null || language === '' || language === 'emupedia') {
					language = 'en';
				} else if (language === 'br') {
					language = 'pt';
				} else if (language !== 'en' && language !== 'tr' && language !== 'br' && language !== 'pt') {
					language = 'en';
				}

				// noinspection JSUnresolvedVariable
				for (var website in blacklist_data.mapping.en.website) {
					// noinspection JSUnresolvedVariable,JSUnfilteredForInLoop
					str = str.replace(new RegExp(blacklist_data.mapping.en.website[website], 'gi'), '``');
				}

				// noinspection JSUnresolvedVariable
				for (var spam1 in blacklist_data.mapping[language].spam) {
					// noinspection JSUnresolvedVariable,JSUnfilteredForInLoop
					str = str.replace(new RegExp(blacklist_data.mapping[language].spam[spam1], 'gi'), '``');
				}

				return str.replace(/  +/g, ' ').trim();
			};

			// noinspection DuplicatedCode
			net.clean = function(str, sent_by_admin, disable_emoji) {
				var me_is_admin = net.is_admin();
				var room_name = net.room_info.name || '';
				var language = room_name.startsWith('Emupedia-') ? net.room_info.name.replace('Emupedia-', '').toLowerCase() : 'en';
				var event_language = language !== 'en' && language !== 'tr' ? 'en' : language;
				var subject;
				var subject_clean;

				if (net.use_events) {
					var eventss = Object.keys(events.mapping[event_language]).sort(function(a, b) {
						return b.length - a.length;
					});

					var found = false;

					for (var event in eventss) {
						var words = events.mapping[event_language][eventss[event]].sort(function(a, b) {
							return b.length - a.length;
						});

						for (var word in words) {
							// noinspection JSUnfilteredForInLoop
							if (~str.toLowerCase().indexOf(words[word])) {
								net.render_event(eventss[event]);
								found = true;
								break;
							}

							if (found) {
								break;
							}
						}
					}
				}

				// noinspection DuplicatedCode
				if (room_name.startsWith('Emupedia') && !sent_by_admin) {
					subject = net.remove_profanity(net.remove_spam(net.remove_duplicates(net.remove_numbers(net.normalize(net.remove_zalgo(str), language !== 'en' ? normalize_types.slice(0, normalize_types.length - 1) : undefined)))));

					if (net.use_blacklist) {
						subject_clean = subject.replace(/&lt;/g, '').replace(/&gt;/g, '').replace(/[-_*?!.,:;#<>(){}\[\]~^'"`|/\\]/g, '');
					} else {
						subject_clean = subject;
					}

					if (net.has_profanity(subject_clean)) {
						subject = net.remove_profanity(subject_clean);
					}
				} else {
					subject = net.remove_combining(net.remove_invisible_before(net.remove_zalgo(str)));
				}

				// noinspection DuplicatedCode
				if (typeof disable_emoji === 'undefined') {
					if (net.use_animated_emoticons) {
						subject = twemoji.parse(emoticons.parse(net.str_replace(emoticons_search, emoticons_replace, subject), {}, emoticons_data.emoticons.mapping), {
							folder: 'svg',
							ext: '.svg'
						});
					} else {
						subject = twemoji.parse(net.str_replace(emoticons_search, emoticons_replace, subject), {}, emoticons_data.emoticons.mapping, {
							folder: 'svg',
							ext: '.svg'
						});
					}
				}

				subject = net.remove_invisible_after(subject);

				if (subject.trim().startsWith('*') || subject.trim().startsWith('-')) {
					subject = '<i' + (net.use_colors ? ' style="color: ' + net.colors[5] + ';"' : '') + '>' + subject + '</i>';
				}

				if (me_is_admin && net.use_blacklist) {
					return '<span title="' + str.replace(/"/g, '&quot;') + '">' + subject + '</span>';
				}

				return subject;
			};

			// noinspection DuplicatedCode
			net.clean_nicknames = function(str, disable_emoji) {
				var room_name = net.room_info.name || '';
				var subject = net.normalize(net.remove_zalgo(str), normalize_types.slice(0, normalize_types.length - 1));
				var subject_clean;

				// noinspection DuplicatedCode
				if (room_name.startsWith('Emupedia')) {
					subject = net.remove_profanity(net.remove_spam(net.remove_duplicates(subject)), 'en');

					if (net.use_blacklist) {
						subject_clean = subject.replace(/&lt;/g, '').replace(/&gt;/g, '').replace(/[-_*?!.,:;#<>(){}\[\]~^'"`|/\\]/g, '');
					} else {
						subject_clean = subject;
					}

					if (net.has_profanity(subject_clean, 'en')) {
						subject = net.remove_profanity(subject_clean, 'en');
					}
				} else {
					subject = net.remove_combining(net.remove_invisible_before(subject));
				}

				// noinspection DuplicatedCode
				if (typeof disable_emoji === 'undefined') {
					if (net.use_animated_emoticons) {
						subject = twemoji.parse(emoticons.parse(net.str_replace(emoticons_search, emoticons_replace, subject), {}, emoticons_data.emoticons.mapping), {
							folder: 'svg',
							ext: '.svg'
						});
					} else {
						subject = twemoji.parse(net.str_replace(emoticons_search, emoticons_replace, subject), {}, emoticons_data.emoticons.mapping, {
							folder: 'svg',
							ext: '.svg'
						});
					}
				}

				subject = net.remove_invisible_after(subject);

				return subject;
			};

			net.render_chat = function(msg, hide) {
				if (msg) {
					net.chat_buffer.push(msg);
					net.spam_buffer.unshift(msg);

					while (net.spam_buffer.length > 100) {
						net.spam_buffer.pop();
					}

					net.output_div.append(net.chat_buffer.slice(-1));

					if (!net.render_chat_msg_hide_timeout) {

						net.render_chat_msg_hide_timeout = setTimeout(function() {
							// noinspection JSUnresolvedFunction
							$('.net_msg_hide').slideUp(200, function() {
								$(this).remove();
							});

							// noinspection JSUnresolvedFunction
							$('.net_msg_hide_last:not(:last-child)').slideUp(200, function() {
								$(this).remove();
							});

							net.render_chat_msg_hide_timeout = false;
						}, hide ? hide : 0);
					}
				}

				var output = net.output_div.get(0);

				if (net.lock_scroll) {
					if (output.scrollHeight - net.output_div.height() < 11) {
						var lines_per_window = Math.floor(net.output_div.height() / 14);
						var lines_to_get = lines_per_window - net.output_div.children().length;

						if (net.chat_buffer.length >= lines_per_window && lines_to_get > 0) {
							var stop = net.chat_buffer.length - 1;
							var start = stop - lines_per_window - 5;

							if (start < 0) {
								start = 0;
							}

							var add_buffer = '';

							for (var i = start; i <= stop; i++) {
								add_buffer += net.chat_buffer[i];
							}

							net.output_div.html(add_buffer);
						}
					}

					while (output.scrollHeight - net.output_div.height() > 50) {
						$(net.output_div.children().get(0)).remove();
					}

					output.scrollTop = output.scrollHeight;
				}
			};

			net.render_room_select = function(cb) {
				var html = '';

				for (var room in net.rooms) {
					// noinspection JSUnfilteredForInLoop
					if (room.startsWith('Emupedia')) {
						// noinspection JSUnfilteredForInLoop
						if (room === net.room_info.name) {
							// noinspection JSUnfilteredForInLoop
							html += '<option selected="selected" value="' + room + '" data-online="' + net.rooms[room] + '">' + room + ' (' + net.rooms[room] + ' user' + (net.rooms[room] > 1 ? 's' : '') + ')</option>'
						} else {
							// noinspection JSUnfilteredForInLoop
							html += '<option value="' + room + '" data-online="' + net.rooms[room] + '">' + room + ' (' + net.rooms[room] + ' user' + (net.rooms[room] > 1 ? 's' : '') + ')</option>'
						}
					}
				}

				// noinspection JSUnresolvedFunction
				net.client_rooms.html(html);

				// noinspection JSUnresolvedVariable
				var users_online = Object.keys(net.room_info.users).length;
				var current_room = net.room_info.name;

				if (!current_room.startsWith('Emupedia')) {
					net.client_rooms.find('option:selected').removeAttr('selected');
					net.client_rooms.prepend('<option selected="selected" value="' + current_room + '" data-online="' + users_online + '">' + current_room + ' (' + users_online + ' user' + (users_online > 1 ? 's' : '') + ')</option>');
				}

				if (typeof cb === 'function') {
					cb();
				}
			};

			net.render_event = function(type) {
				// noinspection HtmlUnknownTarget
				net.event.html('<div class="animate__animated animate__zoomIn"><span>&nbsp;</span><img src="images/events/' + type + '.gif" alt="" /></div>');
				clearTimeout(net.event_timeout);
				net.event_timeout = setTimeout(function() {
					net.event.find('div').first().attr('class', 'animate__animated animate__zoomOut');
				}, 5000);
			};

			net.render_users = function(timeout, force) {
				if (!timeout) {
					timeout = 1500;
				}

				if (!net.room_info) {
					return;
				}

				if (!net.render_users_timeout || force) {
					net.render_users_timeout = setTimeout(function() {
						// noinspection JSUnresolvedVariable
						var users_online = Object.keys(net.room_info.users).length;
						// noinspection JSUnresolvedVariable
						var me = net.room_info.me;
						var me_is_admin = net.is_admin();
						var room = net.room_info.name;

						// noinspection JSUnresolvedFunction
						net.client_room_name.text(room);

						var users_array_default = [];
						var users_array_nick = [];
						var users_list = '';

						// noinspection JSUnresolvedVariable
						for (var users in net.room_info.users) {
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							var user = net.room_info.users[users].info.user;
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							var nick = net.room_info.users[users].info.nick;
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							var xp = net.get_user_level(user)['xp'] || 0;
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							var url = net.room_info.users[users].data.url || '?';
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							var country = net.room_info.users[users].info.country ? net.room_info.users[users].info.country + ' ' + country_codes[net.room_info.users[users].info.country] : '?';

							if (net.is_default_nick(nick)) {
								users_array_default.push([user, nick, xp, url, country]);
							} else {
								users_array_nick.push([user, nick, xp, url, country]);
							}
						}

						// noinspection JSCheckFunctionSignatures
						users_array_nick.sort(function(a, b) {
							if (!net.refresh_users) {
								// sort by nickname
								return a[1].localeCompare(b[1]);
							}

							// sort by xp
							return parseInt(b[2]) - parseInt(a[2]);
						});

						var users_obj = {};
						var nick_obj = {};
						var url_obj = {};
						var country_obj = {};

						users_array_nick.forEach(function(item) {
							users_obj[item[0]] = net.clean_nicknames(item[1]);
							nick_obj[item[0]] = item[1];
							url_obj[item[0]] = item[3];
							country_obj[item[0]] = item[4];
						});

						users_array_default.forEach(function(item) {
							users_obj[item[0]] = net.friendly_name(item[1]);
							nick_obj[item[0]] = item[1];
							url_obj[item[0]] = item[3];
							country_obj[item[0]] = item[4];
						});

						// noinspection JSUnresolvedVariable
						for (var u in users_obj) {
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							var color = u !== me ? net.colors[3] : net.colors[1];
							var glow = '';
							var class_styles = 'class="client_nickname"';

							// noinspection DuplicatedCode
							if (typeof net.room_info !== 'undefined') {
								// noinspection JSUnresolvedVariable
								var room_user = net.room_info.users[u] || false;
								// noinspection JSUnresolvedVariable,DuplicatedCode
								if (room_user && room_user.info.present && ~room_user.info.present.item_index && room_user.info.present.items[room_user.info.present.item_index]) {
									// noinspection JSUnresolvedVariable
									if (room_user.info.present.items[room_user.info.present.item_index].color && net.use_colors) {
										// noinspection JSUnresolvedVariable
										color = room_user.info.present.items[room_user.info.present.item_index].color;
									}
								}

								// noinspection JSUnresolvedVariable
								var user_level = net.get_user_level(u);
								var nickname = nick_obj[u];
								var origin_nickname = me_is_admin ? 'Nickname ' + nickname + '\n' : '';
								var origin_url = me_is_admin ? 'URL ' + url_obj[u] + '\n' : '';
								var origin_country = me_is_admin ? 'Country ' + country_obj[u] + '\n' : '';

								// noinspection DuplicatedCode
								if (typeof net.room_info.data !== 'undefined') {
									// noinspection DuplicatedCode
									if (typeof net.room_info.data.admins !== 'undefined') {
										if (Array.isArray(net.room_info.data.admins)) {
											if (net.room_info.data.admins.length > 0) {
												if (~net.room_info.data.admins.indexOf(u)) {
													glow = !$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow';
												}
											}
										}
									}

									if (net.room_info.host === u) {
										glow = !$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow';
									}
								}
							}

							class_styles = 'class="client_nickname ' + glow + '"';

							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							users_list += '<div id="room_user_' + u + '" ' + class_styles + ' style="color: ' + (glow ? '#4c4c4c' : color) + '; word-break: keep-all; --glow-color-1: ' + color + '; --glow-color-2: ' + net.increase_brightness(color, 20) + ';" data-uid="' + u + '" data-nickname="' + nickname.replace(/"/g, '&quot;') + '" title="' + origin_nickname.replace(/"/g, '&quot;') + origin_url.replace(/"/g, '&quot;') + origin_country.replace(/"/g, '&quot;') + 'Unique ID ' + u + '\n' + 'User Level ' + user_level.curLevel + ', Next Level in ' + user_level.timeRequired + '" data-title="' + origin_nickname.replace(/"/g, '&quot;') + origin_url.replace(/"/g, '&quot;') + origin_country.replace(/"/g, '&quot;') + 'Unique ID ' + u + '\n' + 'User Level ' + user_level.curLevel + ', Next Level in ' + user_level.timeRequired + '">' + users_obj[u] + '</div>';
						}

						// noinspection JSUnresolvedVariable
						net.text_input.attr('placeholder', 'You are typing as "' + (net.is_default_nick(net.room_info.users[net.room_info.me].info.nick) ? net.friendly_name(net.room_info.users[net.room_info.me].info.nick) : net.clean_nicknames(net.room_info.users[net.room_info.me].info.nick, true)) + '". To change nick, type /nick and your new nickname.');
						// noinspection JSUnresolvedFunction
						net.client_room_users.html(users_list);
						// noinspection JSUnresolvedVariable
						net.client_room_online.text(users_online);
						// noinspection JSUnresolvedFunction
						$('.ui-selectmenu-text').text(room + ' (' + users_online + ' user' + (users_online > 1 ? 's' : '') + ')');

						net.render_users_timeout = false;

						if (net.re_render_users_timeout) {
							clearTimeout(net.re_render_users_timeout);
						}

						if (net.refresh_users) {
							net.re_render_users_timeout = setTimeout(function() {
								net.render_users();
							}, 19000);
						}
					}, timeout)
				}
			};

			net.log = function(txt, color, hide) {
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
					txt = '<br /><xmp>' + JSON.stringify(txt, null, 2) + '</xmp>';
				}

				var d = new Date();

				var time_stamp = [
					'<span style="color:' + colors[1] + ';">[',
					('0' + d.getHours()).slice(-2),
					':',
					('0' + d.getMinutes()).slice(-2),
					':',
					('0' + d.getSeconds()).slice(-2),
					']</span>' + (!~txt.indexOf('&nbsp;') ? '&nbsp;' : '')
				].join('');

				var msg_class = typeof hide !== 'undefined' ? (hide > 0 ? 'net_msg_hide' : 'net_msg_hide_last') : 'net_msg';

				net.render_chat('<div class="' + msg_class + '" style="' + color + '">' + time_stamp + txt + '</div>', hide);
			};

			// noinspection DuplicatedCode
			net.send_input = function() {
				// noinspection JSUnresolvedFunction
				var msg = net.text_input.val();
				var is_admin = net.is_admin();

				if (msg.length >= net.max_message_length && !is_admin) {
					msg = msg.substring(0, net.max_message_length - 1);
				}

				if (msg.trim().length <= 1 && !is_admin) {
					net.log('Your message is too short.', 4);
					return false;
				}

				if (msg.trim().length >= 25 && !~msg.trim().indexOf(' ') && !is_admin) {
					net.log('Your message doesn\'t has any spaces.', 4);
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

					if (data.data.charAt(0) === '[' || data.data.charAt(0) === '{') {
						try {
							// noinspection JSUnusedLocalSymbols
							eval('var json_data=' + data.data);
						} catch (e) {
							var json_data = data.data;
						}

						data.data = json_data;
					}

					if (data.cmd === 'nickname' || data.cmd === 'name' || data.cmd === 'n') {
						data.cmd = 'nick';
					}

					if (data.cmd === 'w' || data.cmd === 'whois') {
						data.cmd = 'who';
					}

					if (data.cmd === 'j') {
						data.cmd = 'join';
					}

					if (data.cmd === 't') {
						data.cmd = 'topic';
					}

					if (data.cmd === 'emoji') {
						net.use_animated_emoticons = !net.use_animated_emoticons;
						simplestorage.set('use_animated_emoticons', net.use_animated_emoticons);
						net.render_users(1, true);
					}

					if (data.cmd === 'colors') {
						net.use_colors = !net.use_colors;
						simplestorage.set('use_colors', net.use_colors);
						net.render_users(1, true);
					}

					if (data.cmd === 'users') {
						net.refresh_users = !net.refresh_users;
						simplestorage.set('refresh_users', net.refresh_users);
						net.render_users(1, true);
					}

					// noinspection DuplicatedCode
					if (data.cmd === 'low') {
						net.refresh_users = false;
						net.use_events = false;
						net.use_animated_topic = false;
						net.use_animated_emoticons = false;
						net.use_colors = false;
						simplestorage.set('refresh_users', net.refresh_users);
						simplestorage.set('use_events', net.use_events);
						simplestorage.set('use_animated_topic', net.use_animated_topic);
						simplestorage.set('use_animated_emoticons', net.use_animated_emoticons);
						simplestorage.set('use_colors', net.use_colors);
						net.render_users(1, true);
					}

					// noinspection DuplicatedCode
					if (data.cmd === 'medium') {
						net.refresh_users = true;
						net.use_events = false;
						net.use_animated_topic = false;
						net.use_animated_emoticons = false;
						net.use_colors = true;
						simplestorage.set('refresh_users', net.refresh_users);
						simplestorage.set('use_events', net.use_events);
						simplestorage.set('use_animated_topic', net.use_animated_topic);
						simplestorage.set('use_animated_emoticons', net.use_animated_emoticons);
						simplestorage.set('use_colors', net.use_colors);
						net.render_users(1, true);
					}

					// noinspection DuplicatedCode
					if (data.cmd === 'high') {
						net.refresh_users = true;
						net.use_events = true;
						net.use_animated_topic = true;
						net.use_animated_emoticons = true;
						net.use_colors = true;
						simplestorage.set('refresh_users', net.refresh_users);
						simplestorage.set('use_events', net.use_events);
						simplestorage.set('use_animated_topic', net.use_animated_topic);
						simplestorage.set('use_animated_emoticons', net.use_animated_emoticons);
						simplestorage.set('use_colors', net.use_colors);
						net.render_users(1, true);
					}

					if (net.use_animated_topic) {
						net.client_topic.removeAttr('style');
					} else {
						net.client_topic.attr('style', 'animation: none; padding-left: 0;');
					}

					if (data.cmd === 'topic' && data.data === '') {
						data.data = net.room_info.name.startsWith('Emupedia') ? net.def_topic : net.def_custom_topic;
					}

					if (data.cmd === 'refresh' || data.cmd === 'reload' || data.cmd === 'r') {
						net.send_cmd('send_cmd', ['server.msg', 'server', { msg: 'reloading...' }]);
						data.cmd = 'eval';
						data.data = 'if (window.u_network && window.u_network.reload) { window.u_network.reload(); } else { window.location.reload(); }';
					}

					if (data.cmd === 'rename' || data.cmd === 'ren') {
						data.data = data.data.split(' ');
						var to = data.data.shift();
						data.data = data.data.join(' ');
						net.send_cmd('send_cmd', ['eval', to, { data: "window.u_network.send_cmd('nick', '" + data.data + "')" }]);
					}

					if (data.cmd === 'server' || data.cmd === 's') {
						data.cmd = 'send_cmd';
						data.data = ['server.msg', data.data.startsWith('*') ? 'server' : net.room_info.name, { msg: data.data.startsWith('*') ? data.data.substring(1) : data.data }];
					}

					if (data.cmd === 'clear' || data.cmd === 'c') {
						data.cmd = 'send_cmd';
						data.data = ['server.event', net.room_info.name, { user: net.room_info.me, msg: '' }];
					}

					if (data.cmd === 'image' || data.cmd === 'i') {
						data.cmd = 'send_cmd';
						data.data = ['server.event', net.room_info.name, { user: net.room_info.me, msg: '<img alt="" src="' + data.data + '"/>' }];
					}

					if (data.cmd === 'audio' || data.cmd === 'a') {
						data.cmd = 'send_cmd';
						data.data = ['server.event', net.room_info.name, { user: net.room_info.me, msg: '<audio controls="controls" autoplay="autoplay" src="' + data.data + '"></audio>' }];
					}

					if (data.cmd === 'video' || data.cmd === 'v') {
						data.cmd = 'send_cmd';
						data.data = ['server.event', net.room_info.name, { user: net.room_info.me, msg: '<video autoplay="autoplay" src="' + data.data + '"></video>' }];
					}

					if (!is_admin && ~net.disabled_commands.indexOf(data.cmd)) {
						net.log('Invalid command', 4);
						net.text_input.val('');
						return false;
					}

					if (net.client_cmd(data)) {
						// noinspection JSUnresolvedFunction
						net.text_input.val('');
						return true;
					}

					// noinspection JSUnresolvedFunction
					if (data.cmd === 'nick') {
						data.data = net.remove_spam(net.remove_duplicates(net.remove_numbers(net.remove_zalgo(net.normalize(data.data, normalize_types.slice(0, normalize_types.length - 1))))));
						data.data = data.data.replace(/(<([^>]+)>)/gi, '').replace(/[<>`.,'"]/g, '');

						if (!/[a-z]/i.test(net.normalize(data.data)) || net.remove_combining(net.remove_invisible_after(net.remove_invisible_before(data.data))).trim() === '' || net.remove_combining(net.remove_invisible_after(net.remove_invisible_before(data.data))).trim().length <= 2) {
							net.log('You have unwanted/duplicated characters or your nickname doesn\'t contains any letters or it is too short, correct the issue and try again.', 4);
							return false;
						}
					}

					// noinspection JSUnresolvedFunction
					net.send_cmd(data.cmd, typeof data.data === 'string' ? data.data.trim() : data.data);
					net.text_input.val('');
					return true;
				} else if (net.room_info.name === 'Emupedia' && !is_admin) {
					msg = net.remove_spam(net.remove_duplicates(net.remove_numbers(net.remove_zalgo(net.normalize(msg, normalize_types)))));
				} else if (net.room_info.name.startsWith('Emupedia-TR') && !is_admin) {
					msg = net.remove_spam(net.remove_duplicates(net.remove_numbers(net.remove_zalgo(net.normalize(msg, normalize_types.slice(0, normalize_types.length - 1))))));
				} else if (net.room_info.name.startsWith('Emupedia-') && !is_admin) {
					msg = net.remove_spam(net.remove_duplicates(net.remove_numbers(net.remove_zalgo(net.normalize(msg, normalize_types)))));
				}

				if ((net.remove_combining(net.remove_invisible_after(net.remove_invisible_before(msg)))).trim() === '' || (net.remove_combining(net.remove_invisible_after(net.remove_invisible_before(msg)))).trim().length <= 0) {
					if (net.text_input.val().length > 0) {
						net.log('You have unwanted characters in the message you are trying to send, correct the issue and try again', 4);
					}
					return false;
				}

				var timestamp = Math.floor(Date.now() / 1000);
				// noinspection JSUnresolvedVariable
				var spam_time = net.last_send ? timestamp - net.last_send < 20 : false;

				var clean_msg = net.remove_combining(net.remove_invisible_after(net.remove_invisible_before(msg))).trim();

				// noinspection DuplicatedCode
				if (net.last_msg && !is_admin && spam_time) {
					if (net.last_msg === clean_msg || ((~clean_msg.indexOf(net.last_msg) || ~net.last_msg.indexOf(clean_msg)) && clean_msg.length >= 10)) {
						net.log('You can\'t repeat yourself, write something different', 4);
						return false;
					}
				}

				// noinspection DuplicatedCode
				if (net.last_last_msg && !is_admin && spam_time) {
					if (net.last_last_msg === clean_msg || ((~clean_msg.indexOf(net.last_last_msg) || ~net.last_last_msg.indexOf(clean_msg)) && clean_msg.length >= 10)) {
						net.log('You can\'t repeat yourself, write something different', 4);
						return false;
					}
				}

				// noinspection DuplicatedCode
				if (net.last_last_last_msg && !is_admin && spam_time) {
					if (net.last_last_last_msg === clean_msg || ((~clean_msg.indexOf(net.last_last_last_msg) || ~net.last_last_last_msg.indexOf(clean_msg)) && clean_msg.length >= 10)) {
						net.log('You can\'t repeat yourself, write something different', 4);
						return false;
					}
				}

				if (!net.spam_cap || net.spam_cap < 0) {
					net.spam_cap = 1;
				}

				if (net.last_send && !is_admin) {
					if (timestamp - net.last_send < net.spam_cap) {
						net.last_send = timestamp;
						net.spam_cap++;
						net.log('You are writing too fast, wait ' + net.spam_cap + ' second(s)', 4);
						net.text_input.val('');
						return false;
					}
				}

				net.last_send = timestamp;

				// noinspection JSUnresolvedFunction
				net.send_cmd('room_msg', msg);
				net.last_last_last_msg = net.last_last_msg;
				net.last_last_msg = net.last_msg;
				net.last_msg = clean_msg;
				net.spam_cap = 1;

				// noinspection JSUnresolvedFunction
				net.text_input.val('');
			};

			net.client_cmd = function(args) {
				if (net.room_info) {
					var muted = net.room_info.data.muted || [];

					switch (args.cmd) {
						case 'mute':
							if (!~muted.indexOf(args.data)) {
								muted.push(args.data);
							}

							// noinspection JSUnresolvedFunction
							net.send_cmd('set_room_data', { muted: false });
							// noinspection JSUnresolvedFunction
							net.send_cmd('set_room_data', { muted: muted });
							return true;
						case 'unmute':
							var index = muted.indexOf(args.data);

							if (index > -1) {
								muted.splice(index, 1);
							}

							// noinspection JSUnresolvedFunction
							net.send_cmd('set_room_data', { muted: false });
							// noinspection JSUnresolvedFunction
							net.send_cmd('set_room_data', { muted: muted });
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

			// noinspection DuplicatedCode
			net.relay = function(url, data, type, headers) {
				var ajax_retry_timeout = 1000;
				var ajax_retry_count = 5;
				var ajax_timeout = 15 * 1000;
				var cache = false;
				var data_type = 'text';

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
			};

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable,JSUnusedLocalSymbols
			net.socket.on('connect', function(data) {
				// console.log('connect');
				// console.log(JSON.stringify(data, null, 2));
				net.log('Trying to reconnect...', 4);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('disconnect', function() {
				// console.log('disconnect');
				net.log('You were disconnected from the server...', 4);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('auth.info', function(data) {
				// console.log('auth.info');
				// console.log(JSON.stringify(data, null, 2));

				// noinspection JSUnresolvedVariable
				if (data.login) {
					simplestorage.set('uid', data.login);
				}

				// noinspection JSUnresolvedVariable
				if (data.login === data.info.nick) {
					net.log('Type /nick <nickname> to set your name', 0);
				}

				// noinspection JSUnresolvedFunction
				net.send_cmd('list', {});

				if (window.top === window) {
					// console.log('no_iframe');
					// console.log(JSON.stringify({url: window.location.href, country: simplestorage.get('country')}, null, 2));
					net.send_cmd('set_data', { url: window.location.href, country: simplestorage.get('country') });
				}
			});

			net.socket.on('iframe_ready', function(data) {
				// console.log('iframe_ready');
				// console.log(JSON.stringify(data, null, 2));
				net.send_cmd('set_data', { url: data.url, country: data.country });
			});

			net.socket.on('su', function(data) {
				if (data) {
					// noinspection DuplicatedCode
					if (typeof net.room_info !== 'undefined') {
						if (typeof net.room_info.data !== 'undefined') {
							if (typeof net.room_info.data.admins !== 'undefined') {
								if (Array.isArray(net.room_info.data.admins)) {
									if (net.room_info.data.admins.indexOf(net.room_info.me) === -1) {
										net.room_info.data.admins.push(net.room_info.me);
									} else {
										net.room_info.data.admins.splice(net.room_info.data.admins.indexOf(net.room_info.me), 1)
									}
									net.send_cmd('set_room_data', { admins: 1 });
									net.send_cmd('set_room_data', { admins: net.room_info.data.admins });
								} else {
									net.send_cmd('set_room_data', { admins: 1 });
									net.send_cmd('set_room_data', { admins: [net.room_info.me] });
								}
							} else {
								net.send_cmd('set_room_data', { admins: 1 });
								net.send_cmd('set_room_data', { admins: [net.room_info.me] });
							}
						}
					}

					if (net.is_admin()) {
						net.text_input.removeAttr('maxlength');
					} else {
						net.text_input.attr('maxlength', net.max_message_length);
					}
				}
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable,DuplicatedCode
			net.socket.on('room.info', function(data) {
				// console.log('room.info');
				// console.log(JSON.stringify(data, null, 2));

				net.room_info = data;

				if (!net.def_topic) {
					net.def_topic = net.client_topic.html();
					net.def_custom_topic = 'If your nickname glows, you are the current owner of the room, you can change this topic by typing /topic and the new room topic. If you experience any lag you might try and uncheck some settings from the ⚙️ panel.';
				}

				// noinspection JSUnresolvedVariable
				var topic = net.room_info.data.topic || (net.room_info.name.startsWith('Emupedia') ? net.def_topic : net.def_custom_topic);
				net.client_topic.html(topic);

				if (!net.use_animated_topic && net.client_topic) {
					net.client_topic.attr('style', 'animation: none; padding-left: 0;');
				}

				if (typeof net.room_info.data !== 'undefined') {
					if (typeof net.room_info.data.admins !== 'undefined') {
						if (Array.isArray(net.room_info.data.admins)) {
							net.admins = JSON.parse(JSON.stringify(net.room_info.data.admins)) || [];
						} else {
							net.admins = [];
						}
					} else {
						net.admins = [];
					}
				} else {
					net.admins = [];
				}

				net.render_users(1, true);

				net.chat_buffer = [];
				net.spam_buffer = [];
				net.lock_scroll = true;
				net.output_div.html('');
				// noinspection JSUnresolvedVariable
				var users_online = Object.keys(net.room_info.users).length;
				var room = net.room_info.name;

				net.log('You are now talking in ' + room + ' with ' + users_online + ' user' + (users_online > 1 ? 's' : ''), 1);

				if (!room.startsWith('Emupedia')) {
					net.client_rooms.find('option:selected').removeAttr('selected');
					net.client_rooms.prepend('<option selected="selected" value="' + room + '" data-online="' + users_online + '">' + room + ' (' + users_online + ' user' + (users_online > 1 ? 's' : '') + ')</option>').selectmenu('refresh');
					net.log('<img class="emoji" draggable="false" alt="⚠" src="https://twemoji.maxcdn.com/v/13.0.1/72x72/26a0.png"> CAUTION! Emupedia is not responsible for what happens in private channels! The chat is not beign actively monitored by moderators, you may experience swearing, bullying, harassing or lewd and explicit behaviour.', 4);
				}

				if (net.is_admin()) {
					net.text_input.removeAttr('maxlength');
				} else {
					net.text_input.attr('maxlength', net.max_message_length);
				}
			});

			net.socket.on('room.host', function(data) {
				if (!net.room_info) {
					return;
				}

				var user = $('#room_user_' + net.room_info.host);
				user.css('color', '#4c4c4c').removeClass('glow glow2');
				net.room_info.host = data;
				user.css('color', '#4c4c4c').addClass(!$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow');
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.data', function(data) {
				// console.log('room.data');
				// console.log(JSON.stringify(data, null, 2));
				net.room_info.data = $.extend(net.room_info.data, data.data);
				// noinspection JSUnresolvedVariable
				if (typeof net.room_info.data.topic !== 'undefined') {
					// noinspection JSUnresolvedVariable
					var topic = net.room_info.data.topic || (net.room_info.name.startsWith('Emupedia') ? net.def_topic : net.def_custom_topic);
					// noinspection JSUnresolvedVariable
					net.client_topic.html(topic);
				}

				if (typeof net.room_info.data.admins !== 'undefined') {
					if (Array.isArray(net.room_info.data.admins)) {
						$('#client_room_users > div').removeClass('glow glow2');

						if (net.admins.length !== JSON.parse(JSON.stringify(net.room_info.data.admins)).length) {
							net.admins = JSON.parse(JSON.stringify(net.room_info.data.admins));

							if (typeof net.admins !== 'undefined') {
								if (Array.isArray(net.admins)) {
									for (var a2 in net.admins) {
										// noinspection JSUnfilteredForInLoop
										if (typeof net.admins[a2] !== 'undefined') {
											// noinspection JSUnfilteredForInLoop
											$('#room_user_' + net.admins[a2]).css('color', '#4c4c4c').addClass(!$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow');
										}
									}
								}
							}
						}
					}
				}

				$('#room_user_' + net.room_info.host).css('color', '#4c4c4c').addClass(!$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow');

				if (net.is_admin()) {
					net.text_input.removeAttr('maxlength');
				} else {
					net.text_input.attr('maxlength', net.max_message_length);
				}
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable,DuplicatedCode
			net.socket.on('room.user_join', function(data) {
				if (!net.room_info) {
					return;
				}

				// noinspection JSUnresolvedVariable
				net.room_info.users[data.user] = data.data;
				// noinspection JSUnresolvedVariable
				net.client_room_online.text(Object.keys(net.room_info.users).length);

				// noinspection JSUnresolvedVariable
				$('.ui-selectmenu-text').text(net.room_info.name + ' (' + Object.keys(net.room_info.users).length + ' user' + (Object.keys(net.room_info.users).length > 1 ? 's' : '') + ')');

				var color = net.colors[3];
				var glow = '';
				// noinspection JSUnresolvedVariable
				var room_user = net.room_info.users[data.user] || false;

				// noinspection JSUnresolvedVariable,DuplicatedCode
				if (room_user && room_user.info.present && ~room_user.info.present.item_index && room_user.info.present.items[room_user.info.present.item_index] && net.use_colors) {
					// noinspection JSUnresolvedVariable
					if (room_user.info.present.items[room_user.info.present.item_index].color) {
						// noinspection JSUnresolvedVariable
						color = room_user.info.present.items[room_user.info.present.item_index].color;
					}
				}

				if (typeof net.room_info.data !== 'undefined') {
					if (typeof net.room_info.data.admins !== 'undefined') {
						if (Array.isArray(net.room_info.data.admins)) {
							if (net.room_info.data.admins.length > 0) {
								if (~net.room_info.data.admins.indexOf(data.data.info.user)) {
									glow = 'class="' + (!$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow') + '"';
								}
							}
						}
					}
				}

				var user_level = net.get_user_level(data.user);

				// noinspection JSUnresolvedVariable
				net.client_room_users.append('<div id="room_user_' + data.data.info.user + '" ' + glow + ' style="color: ' + (glow ? '#4c4c4c' : color) + '; word-break: keep-all; --glow-color-1: ' + color + '; --glow-color-2: ' + net.increase_brightness(color, 20) + ';" title="Unique ID ' + data.data.info.user + '\n' + 'User Level ' + user_level.curLevel + ', Next Level in ' + user_level.timeRequired + '" data-title="Unique ID ' + data.data.info.user + '\n' + 'User Level ' + user_level.curLevel + ', Next Level in ' + user_level.timeRequired + '">' + (net.is_default_nick(data.data.info.nick) ? net.friendly_name(data.data.info.nick) : net.clean_nicknames(data.data.info.nick)) + '</div>');

				if (net.refresh_users) {
					net.render_users(6000);
				}
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.user_leave', function(data) {
				if (!net.room_info) {
					return
				}

				// noinspection JSUnresolvedVariable
				if (net.room_info.users[data.user]) {
					// noinspection JSUnresolvedVariable
					delete net.room_info.users[data.user];
				}

				var $el = $('#room_user_' + data.user);

				setTimeout(function() {
					// noinspection JSUnresolvedFunction,JSValidateTypes,DuplicatedCode
					$el.slideUp(200, function() {
						$(this).remove();
						// noinspection JSUnresolvedVariable
						net.client_room_online.text(Object.keys(net.room_info.users).length);
						// noinspection JSUnresolvedVariable
						$('.ui-selectmenu-text').text(net.room_info.name + ' (' + Object.keys(net.room_info.users).length + ' user' + (Object.keys(net.room_info.users).length > 1 ? 's' : '') + ')');
					});
				}, 1000);

			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable,DuplicatedCode
			net.socket.on('room.msg', function(data) {
				// console.log('room.msg');
				// console.log(JSON.stringify(data, null, 2));

				if (!net.check_msg(data)) {
					return false;
				}

				var timestamp = Math.floor(Date.now() / 1000);
				var user = data.user;
				var is_admin = net.is_admin(user);
				var me_is_admin = net.is_admin();
				var cc = '';
				var nick = '';
				var nickname = '';
				var origin_nickname = '';
				var origin_url = '';
				var origin_country = '';
				var class_styles = '';

				if (!net.user_spam_buffer) {
					net.user_spam_buffer = {}
				}

				if (!net.user_spam_buffer[user]) {
					net.user_spam_buffer[user] = {
						spam_cap: 0,
						last_send: 0
					}
				}
				var spam_time = net.user_spam_buffer[user].last_send ? timestamp - net.user_spam_buffer[user].last_send < 20 : false;
				var clean_msg = net.remove_combining(net.remove_invisible_after(net.remove_invisible_before(data.msg))).trim();

				if (net.user_spam_buffer[user].last_last_last_msg && !is_admin && spam_time) {
					if (net.user_spam_buffer[user].last_last_last_msg === clean_msg || ((~clean_msg.indexOf(net.user_spam_buffer[user].last_last_last_msg) || ~net.user_spam_buffer[user].last_last_last_msg.indexOf(clean_msg)) && clean_msg.length >= 10)) {
						return false;
					}
				}

				if (!net.user_spam_buffer[user].spam_cap || net.user_spam_buffer[user].spam_cap < 0) {
					net.user_spam_buffer[user].spam_cap = 1;
				}

				if (net.user_spam_buffer[user].last_send && !is_admin) {
					if (timestamp - net.user_spam_buffer[user].last_send < net.user_spam_buffer[user].spam_cap) {
						net.user_spam_buffer[user].last_send = timestamp;
						net.user_spam_buffer[user].spam_cap++;
						return false;
					}
				}

				net.user_spam_buffer[user].last_send = timestamp;

				net.user_spam_buffer[user].last_last_last_msg = net.user_spam_buffer[user].last_last_msg;
				net.user_spam_buffer[user].last_last_msg = net.user_spam_buffer[user].last_msg;
				net.user_spam_buffer[user].last_msg = clean_msg;
				net.user_spam_buffer[user].spam_cap = 1;

				// noinspection JSUnresolvedVariable
				if (typeof net.room_info !== 'undefined' && typeof net.room_info.users[user] !== 'undefined' && typeof net.room_info.users[user].info !== 'undefined' && typeof net.room_info.users[user].info.nick !== 'undefined') {
					if (me_is_admin && net.show_flags) {
						// noinspection JSUnresolvedVariable
						cc = net.room_info.users[user].data.country ? net.country_code_emoji(net.room_info.users[user].data.country) : '';
						cc = twemoji.parse(net.str_replace(emoticons_search, emoticons_replace, cc), {}, emoticons_data.emoticons.mapping, {
							folder: 'svg',
							ext: '.svg'
						});
						// noinspection JSUnresolvedVariable
						cc = cc !== '' ? '<span title="' + country_codes[net.room_info.users[user].data.country] + '" style="color: ' + net.colors[1] + ';">[' + cc + ']</span>' : '';
					}

					// noinspection JSUnresolvedVariable
					nick = net.is_default_nick(net.room_info.users[user].info.nick) ? net.friendly_name(net.room_info.users[user].info.nick) : net.clean_nicknames(net.room_info.users[user].info.nick);
					// noinspection JSUnresolvedVariable
					nickname = net.room_info.users[user].info.nick;
					origin_nickname = me_is_admin ? 'Nickname ' + nickname + '\n' : '';
					// noinspection JSUnresolvedVariable
					origin_url = me_is_admin ? 'URL ' + (net.room_info.users[user].data.url || '?') + '\n' : '';
					// noinspection JSUnresolvedVariable
					origin_country = me_is_admin ? 'Country ' + (net.room_info.users[user].info.country ? (net.room_info.users[user].info.country + ' ' + country_codes[net.room_info.users[user].info.country]) : '?') + '\n' : '';
				}

				var color = net.colors[3];
				var glow = '';

				// noinspection JSUnresolvedFunction,JSUnresolvedVariable,DuplicatedCode
				if (typeof net.room_info !== 'undefined') {
					// noinspection JSUnresolvedVariable
					var room_user = net.room_info.users[user] || false;
					// noinspection JSUnresolvedVariable,DuplicatedCode
					if (room_user && room_user.info.present && ~room_user.info.present.item_index && room_user.info.present.items[room_user.info.present.item_index] && net.use_colors) {
						// noinspection JSUnresolvedVariable
						if (room_user.info.present.items[room_user.info.present.item_index].color) {
							// noinspection JSUnresolvedVariable
							color = room_user.info.present.items[room_user.info.present.item_index].color;
						}
					}

					// noinspection DuplicatedCode
					if (typeof net.room_info.data !== 'undefined') {
						// noinspection DuplicatedCode
						if (typeof net.room_info.data.admins !== 'undefined') {
							if (Array.isArray(net.room_info.data.admins)) {
								if (net.room_info.data.admins.length > 0) {
									if (~net.room_info.data.admins.indexOf(user)) {
										glow = !$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow';
									}
								}
							}
						}
					}

					if (user === net.room_info.host) {
						glow = !$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow';
					}
				}

				if (!is_admin && data.msg.length >= net.max_message_length) {
					data.msg = data.msg.substring(0, net.max_message_length - 1);
				}


				// noinspection JSUnresolvedVariable
				var user_level = net.get_user_level(user);

				class_styles = 'class="client_nickname ' + glow + '"';

				net.log('<span title="User Level ' + user_level.curLevel + ', Next Level in ' + user_level.timeRequired + '" style="color: ' + net.colors[1] + ';">[' + net.romanize(user_level.curLevel) + ']</span>' + cc + '<span ' + class_styles + ' style="color: ' + (glow ? '#4c4c4c' : color) + '; overflow: hidden; --glow-color-1: ' + color + '; --glow-color-2: ' + net.increase_brightness(color, 20) + ';" data-uid="' + user + '" data-nickname="' + nickname.replace(/"/g, '&quot;') + '" title="' + origin_nickname.replace(/"/g, '&quot;') + origin_url.replace(/"/g, '&quot;') + origin_country.replace(/"/g, '&quot;') + 'Unique ID ' + user + '\nUser Level ' + user_level.curLevel + ', Next Level in ' + user_level.timeRequired + '">[' + nick + ']&nbsp;</span>' + net.clean(data.msg, is_admin));
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('room.user_info', function(data) {
				// console.log('room.user_info');
				// console.log(JSON.stringify(data, null, 2));

				if (net.room_info) {
					// noinspection JSUnresolvedVariable
					if (net.room_info.users[data.user]) {
						for (var n in data.info) {
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							net.room_info.users[data.user].info[n] = data.info[n];
						}

						// noinspection JSUnresolvedVariable,DuplicatedCode
						if (data.info.nick) {
							// noinspection JSUnresolvedVariable
							var XP = net.room_info.users[data.user] && net.room_info.users[data.user].info ? net.room_info.users[data.user].info.online_time + Math.floor((Date.now() - Date.parse(net.room_info.users[data.user].info.last_login_date)) / 1000) : 1;
							var div = 50;
							var curPoints = (XP <= 0 ? 1 : XP) / div;
							var curLevel = Math.floor(.25 * Math.sqrt(curPoints)) + 1;
							var pointsNextLevel = Math.pow((curLevel + 1) * 4, 2);
							var pointsRequired = pointsNextLevel - curPoints;
							// noinspection JSUnusedAssignment
							var timeRequired = '∞';

							try {
								timeRequired = new Date((pointsRequired * div) * 1000).toISOString().substr(11, 8);
							} catch (e) {
								timeRequired = '∞';
							}

							// noinspection JSUnresolvedVariable,JSUnresolvedFunction
							$('#room_user_' + data.user).attr('data-title', 'Unique ID ' + data.user + '\n' + 'User Level ' + curLevel + ', Next Level in ' + timeRequired).data('title', 'Unique ID ' + data.user + '\n' + 'User Level ' + curLevel + ', Next Level in ' + timeRequired).html(net.is_default_nick(data.info.nick) ? net.friendly_name(data.info.nick) : net.clean_nicknames(data.info.nick));
						}

						// noinspection JSUnresolvedVariable
						if (data.info.present && ~data.info.present.item_index) {
							// noinspection JSUnresolvedVariable,JSUnresolvedFunction
							var present = data.info.present.items[data.info.present.item_index];

							if (present && present.color && net.use_colors) {
								// noinspection JSJQueryEfficiency
								$('#room_user_' + data.user).css('color', $('#room_user_' + data.user).hasClass('glow') || $('#room_user_' + data.user).hasClass('glow2') ? '#4c4c4c' : present.color).css('--glow-color-1', present.color).css('--glow-color-2', net.increase_brightness(present.color, 20));
							}
						}

						// noinspection JSUnresolvedVariable
						if (data.user === net.room_info.me) {
							// noinspection JSUnresolvedVariable
							if (data.info.nick) {
								// noinspection JSUnresolvedFunction,JSUnresolvedVariable
								net.text_input.attr('placeholder', 'You are typing as "' + (net.is_default_nick(data.info.nick) ? net.friendly_name(data.info.nick) : net.clean_nicknames(data.info.nick, true)) + '". To change it, type /nick and your new nickname.');
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

			net.socket.on('present.info', function(data) {
				if (typeof data !== 'undefined') {
					if (typeof data.items !== 'undefined') {
						var html = [
							'<label><input class="settings_input" id="use_blacklist" type="checkbox" ' + (net.use_blacklist ? 'checked="checked"' : '') + '>&nbsp;Words censorship</label>',
							'<label><input class="settings_input" id="use_events" type="checkbox" ' + (net.use_events ? 'checked="checked"' : '') + '>&nbsp;Animate background</label>',
							'<label><input class="settings_input" id="use_animated_emoticons" type="checkbox" ' + (net.use_animated_emoticons ? 'checked="checked"' : '') + '>&nbsp;Animate emojis</label>',
							'<label><input class="settings_input" id="use_animated_topic" type="checkbox" ' + (net.use_animated_topic ? 'checked="checked"' : '') + '>&nbsp;Animate topic</label>',
							'<label><input class="settings_input" id="refresh_users" type="checkbox" ' + (net.refresh_users ? 'checked="checked"' : '') + '>&nbsp;Auto sort users by level</label>',
							'<label><input class="settings_input" id="use_colors" type="checkbox" ' + (net.use_colors ? 'checked="checked"' : '') + '>&nbsp;Show colors</label><hr style="margin:0;"/>',
							'<span class="preset_settings" style="cursor:pointer;font-size:10px;margin-right:10px;">Low</span>',
							'<span class="preset_settings" style="cursor:pointer;font-size:10px;margin-right:10px;">Medium</span>',
							'<span class="preset_settings" style="cursor:pointer;font-size:10px">High</span>'
						].join('') + '<hr />';

						// noinspection JSUnresolvedVariable
						if (data.claimable) {
							// noinspection JSUnresolvedVariable
							var label = (data.custom_color) ? '<input type="color" id="custom_color" /> New color! ' : '🎁 Click here to claim a new color!';
							html += '<a href="javascript:;" class="color-claim" style="color: orange; text-decoration: none;">' + label + '</a><hr />';
						}

						var i = 1;
						var last_color = '#000000';

						for (var item in data.items) {
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							html += '<a href="javascript:;" class="color" style="color: ' + ((i - 1) === data.item_index ? '#ffffff' : data.items[item].color) + '; text-decoration:none; ' + ((i - 1) === data.item_index ? 'background-color:' + data.items[item].color : '') + '" data-index="' + i + '" data-color="' + data.items[item].color + '">Color ' + i + '</a>';
							i++;
							// noinspection JSUnfilteredForInLoop
							last_color = data.items[item].color;
						}

						net.color_popover.html(html);

						$('.preset_settings').on('mouseover', function() {
							$(this).css('text-decoration', 'underline');
						}).on('mouseout', function() {
							$(this).css('text-decoration', 'none');
						}).on('click', function() {
							net.text_input.val('/' + $(this).html().toLowerCase());
							net.send_input();

							$('.settings_input').each(function() {
								$(this).prop('checked', net[$(this).prop('id')]);
							});
						});

						$('#use_colors').off('change').on('change', function() {
							net.use_colors = $(this).prop('checked');
							simplestorage.set('use_colors', net.use_colors);
							net.render_users(1, true);
						});

						$('#use_blacklist').off('change').on('change', function() {
							net.use_blacklist = $(this).prop('checked');
							simplestorage.set('use_blacklist', net.use_blacklist);
						});

						$('#use_events').off('change').on('change', function() {
							net.use_events = $(this).prop('checked');
							simplestorage.set('use_events', net.use_events);
						});

						$('#use_animated_topic').off('change').on('change', function() {
							net.use_animated_topic = $(this).prop('checked');
							simplestorage.set('use_animated_topic', net.use_animated_topic);

							if (net.use_animated_topic) {
								net.client_topic.removeAttr('style');
							} else {
								net.client_topic.attr('style', 'animation: none; padding-left: 0;');
							}
						});

						$('#use_animated_emoticons').off('change').on('change', function() {
							net.use_animated_emoticons = $(this).prop('checked');
							simplestorage.set('use_animated_emoticons', net.use_animated_emoticons);
							net.render_users(1, true);
						});

						$('#refresh_users').off('change').on('change', function() {
							net.refresh_users = $(this).prop('checked');
							simplestorage.set('refresh_users', net.refresh_users);
							net.render_users(1, true);
						});

						// noinspection JSUnresolvedVariable
						if (data.claimable && data.custom_color) {
							$('#custom_color').spectrum({
								appendTo: '#client_color_popover',
								allowEmpty: true,
								color: last_color
							}).on('change', function(e, color) {
								net.send_cmd('present', color.toHexString());
							});
						}
					}

					net.color_popover_instance.update();

					if (!net.color_popover.hasClass('show')) {
						net.color_popover.css('visibility', 'visible');
						net.color_popover.addClass('show');
					}
				}
			});

			net.socket.on('server.msg', function(data) {
				// console.log('server.msg');
				// console.log(JSON.stringify(data, null, 2));
				var glow = 'class="' + (!$sys.browser.isIE && !$sys.browser.isFirefox ? 'glow2' : 'glow') + '"';
				var style = 'color: ' + net.colors[4] + '; word-break: keep-all; --glow-color-1: ' + net.colors[4] + '; --glow-color-2: ' + net.increase_brightness(net.colors[4], 20);
				net.log('<span ' + glow + ' style="' + style + '">[SERVER]&nbsp;' + data.msg + '</span>', 4);
			});

			net.socket.on('server.event', function(data) {
				// console.log('server.event');
				// console.log(JSON.stringify(data, null, 2));

				var el;

				if (typeof data.msg === 'string') {
					if (data.msg !== '') {
						// noinspection HtmlUnknownTarget
						net.event.html('<div class="animate__animated animate__zoomIn"><span>&nbsp;</span>' + data.msg + '</div>');

						el = net.event.find('audio, video').first().get(0);

						if (typeof el !== 'undefined') {
							el.onended = function() {
								net.event.find('div').first().attr('class', 'animate__animated animate__zoomOut');
							};
						}
					} else {
						el = net.event.find('audio, video').first().get(0);

						if (typeof el !== 'undefined') {
							if (typeof el.pause === 'function') {
								el.pause();
							}
						}

						net.event.find('div').first().attr('class', 'animate__animated animate__zoomOut');
					}
				}
			});

			// noinspection DuplicatedCode
			net.socket.on('server.who', function(data) {
				// console.log('server.who');
				// console.log(JSON.stringify(data, null, 2));

				var keys = Object.keys(data);
				var res = '';

				for (var key in keys) {
					res += '<b>Nickname</b> ' + data[keys[key]][0]['info']['nick'] + ' ';
					res += '<b>Country</b> ' + data[keys[key]][0]['location']['country'] + ' ';
					res += '<b>Region</b> ' + data[keys[key]][0]['location']['region'] + ' ';
					res += '<b>City</b> ' + data[keys[key]][0]['location']['city'] + ' ';
					res += '<b>Timezone</b> ' + data[keys[key]][0]['location']['timezone'] + ' ';
				}

				net.log('<span style="color: ' + net.colors[4] + ';">[WHOIS]&nbsp;' + res + '</span>', 4);
			});

			// noinspection JSUnresolvedFunction,JSUnresolvedVariable
			net.socket.on('server.help', function(data) {
				// console.log('server.help');
				// console.log(JSON.stringify(data, null, 2));

				var is_admin = net.is_admin();

				var msg = '';

				for (var n in data) {
					// noinspection JSUnfilteredForInLoop
					if (!is_admin && ~net.disabled_commands.indexOf(data[n])) {
						continue;
					}

					// noinspection JSUnfilteredForInLoop
					msg += '<a class="do_cmd" style="cursor: pointer; color: ' + net.colors[2] + ';">/' + data[n] + '</a>&nbsp;';
				}

				net.log('<span style="color: ' + net.colors[4] + ';">[COMMANDS]&nbsp;' + msg + '</span>', 4);
			});

			net.socket.on('chat.show', function() {
				net.last_true_lock = (Date.now() / 1000);
				net.lock_scroll = true;
				net.output_div.html('');
				net.text_input.get(0).focus();
			});

			net.console = $('#client_container');
			net.emoji_button = $('#client_emoticons');
			net.color_button = $('#client_colors');
			net.color_popover = $('#client_color_popover');
			net.text_input = $('#client_command');
			net.text_input_button = $('#client_command_send');
			net.output_div = $('#client_output');
			net.output_div.on('scroll', function() {
				var output = net.output_div.get(0);

				if (!net.last_true_lock) {
					net.last_true_lock = Date.now() / 1000;
				}

				var scroll_lock = output.scrollTop + output.offsetHeight + 15 > output.scrollHeight;

				var old = net.lock_scroll;

				if ((Date.now() / 1000) - net.last_true_lock > 0.05 && scroll_lock !== old) {
					net.lock_scroll = scroll_lock;
					net.last_true_lock = Date.now() / 1000;

					if (net.lock_scroll) {
						net.render_chat()
					}
				}

				if (net.output_div.get(0).scrollTop === 0 && !net.lock_scroll) {
					var stop = net.chat_buffer.length - net.output_div.children().length - 2;

					if (stop > 0) {
						var start = stop - 4;

						if (start < 0) {
							start = 0;
						}

						var add_buffer = '';

						for (var i = start; i < stop; i++) {
							add_buffer += '\n' + net.chat_buffer[i];
						}

						net.output_div.prepend(add_buffer);
						net.output_div.get(0).scrollTop += 50
					}
				}
			});

			net.event = $('#event');
			net.client_topic = $('#topic_output');
			net.client_room_users = $('#client_room_users');
			net.client_room = $('#client_room');
			net.client_rooms = $('#client_rooms');
			net.client_room_name = net.client_room.find('span.name');
			net.client_room_online = net.client_room.find('span.online');

			net.console.show();
			net.event.show();

			// noinspection JSUnresolvedFunction,DuplicatedCode
			net.text_input.off('keypress').on('keypress', function(e) {
				// noinspection JSDeprecatedSymbols
				switch (e.which) {
					case 13:
						net.send_input();
						break;
					case 96:
						try {
							if (typeof window.top !== 'undefined') {
								if (typeof window.top['NETWORK_CONNECTION'] !== 'undefined') {
									if (typeof window.top['NETWORK_CONNECTION']['hide'] === 'function') {
										window.top['NETWORK_CONNECTION']['hide']();
										e.preventDefault();
									}
								}
							}
						} catch (e) {}
						break;
				}
			}).off('paste').on('paste', function(e) {
				if (typeof e.originalEvent.clipboardData !== 'undefined') {
					// noinspection DuplicatedCode
					if (typeof e.originalEvent.clipboardData.getData === 'function') {
						var paste = e.originalEvent.clipboardData.getData('text');

						if (!net.is_admin() && (net.text_input.val().length + paste.length > net.max_paste_length)) {
							e.preventDefault();
							return false;
						}
					}
				}
			});

			// noinspection JSUnresolvedFunction
			net.text_input_button.off('click').on('click', function() {
				net.send_input();
			});

			$('.client_topic').off('mouseenter mouseleave').on('mouseenter', function() {
				if (!net.use_animated_topic) {
					net.client_topic.attr('style', 'animation: client_topic 20s linear infinite; padding-left: 0;');
				} else {
					net.client_topic.removeAttr('style');
				}
			}).on('mouseleave', function() {
				if (!net.use_animated_topic) {
					net.client_topic.attr('style', 'animation: none; padding-left: 0;');
				} else {
					net.client_topic.removeAttr('style');
				}
			});

			picker.on('emoji', function(emoji) {
				net.text_input.get(0).value += emoji;
			});

			Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;

			// noinspection JSUnresolvedFunction
			net.color_popover_instance = new Popper(net.emoji_button.get(0), net.color_popover.get(0), {
				placement: 'top-start',
				modifiers: {
					flip: {
						behavior: ['left']
					},
					offset: {
						enabled: true,
						offset: '0,2'
					}
				}
			});

			net.emoji_button.off('click').on('click', function() {
				picker.togglePicker(net.emoji_button.get(0));
			});

			net.color_button.off('click').on('click', function() {
				if (!net.color_popover.hasClass('show')) {
					net.send_cmd('present', '');
				} else {
					net.color_popover.removeClass('show');
					setTimeout(function() {
						net.color_popover.css('visibility', 'hidden');
					}, 200);
				}
			});

			$(document).on('click', '#client_color_popover a.color', function() {
				net.send_cmd('present', $(this).data('index'));
			});

			$(document).on('click', '#client_color_popover a.color-claim', function() {
				if ($('#client_color_popover a.color-claim').html().indexOf('CUSTOM') === -1) {
					net.color_popover.removeClass('show');
					net.send_cmd('present', 'claim');
				}
			});

			$(document).on('click', '.client_nickname', function(e) {
				if (e.shiftKey) {
					if ($sys.feature.CLIPBOARD) {
						// noinspection JSIgnoredPromiseFromCall
						navigator.clipboard.writeText($(this).data('uid'));
					}

					if (!net.is_admin()) {
						if (net.text_input.val().length + $(this).data('uid').length < net.max_paste_length) {
							net.text_input.get(0).value += $(this).data('uid') + ' ';
							net.text_input.focus();
						}
					} else {
						net.text_input.get(0).value += $(this).data('uid') + ' ';
						net.text_input.focus();
					}
				} else {
					if ($sys.feature.CLIPBOARD) {
						// noinspection JSIgnoredPromiseFromCall
						navigator.clipboard.writeText($(this).data('nickname'));
					}

					if (!net.is_admin()) {
						if (net.text_input.val().length + $(this).data('nickname').length < net.max_paste_length) {
							net.text_input.get(0).value += $(this).data('nickname') + ' ';
							net.text_input.focus();
						}
					} else {
						net.text_input.get(0).value += $(this).data('nickname') + ' ';
						net.text_input.focus();
					}
				}
			});

			$(document).on('click', '.do_cmd', function() {
				// noinspection JSUnresolvedFunction
				net.text_input.get(0).value += $(this).text() + ' ';
				net.text_input.focus();
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

			$(document).mouseup(function(e) {
				if (!net.color_popover.is(e.target) && !net.color_button.is(e.target) && net.color_popover.has(e.target).length === 0) {
					net.color_popover.removeClass('show');

					setTimeout(function() {
						net.color_popover.css('visibility', 'hidden');
					}, 200);
				}
			});

			$(window).on('resize', function() {
				net.render_chat();
			});
		});
	});
}(this));