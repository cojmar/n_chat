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
        'json!../data/adjectives.json',
        'json!../data/animals.json',
        'json!../data/colors.json',
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
    ], function($, jqueryui, emoticons_data, normalize_data, blacklist_data, adjectives, animals, colors, emoticons, twemoji, seedrandom, simplestorage, EmojiButton, network, ajaxretry, Popper, ga, spectrum) {
        $(function() {





            if (typeof ga === 'function') {
                ga('send', {
                    hitType: 'pageview',
                    page: window.location.pathname,
                    title: window.location.href
                });
            }

            var $body = $('body');
            var servers = ['wss://ws.emupedia.net/ws/', 'wss://ws.emupedia.org/ws/', 'wss://ws.emuos.net/ws/', 'wss://ws.emuos.org/ws/', 'ws://cojmar.ddns.net/ws/'];
            var domains = ['emupedia.net', 'emupedia.org', 'emuos.net', 'emuos.org', 'cojmar.ddns.net'];

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

            var search = Object.keys(emoticons_data.mapping);
            var replace = Object.values(emoticons_data.mapping);
            // noinspection JSUnusedLocalSymbols
            var normalize = Object.keys(normalize_data.mapping);

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

            net.colors = ['#b4adad', '#395fa4', '#159904', '#4c4c4c'];

            net.increase_brightness = function(hex, percent) {
                hex = hex.replace(/^\s*#|\s*$/g, '');

                if (hex.length === 3) {
                    hex = hex.replace(/(.)/g, '$1$1');
                }

                var r = parseInt(hex.substr(0, 2), 16),
                    g = parseInt(hex.substr(2, 2), 16),
                    b = parseInt(hex.substr(4, 2), 16);

                return '#' + ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) + ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) + ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
            }

            net.random_integer = function(rand, min, max) {
                return Math.floor(rand * (max - min + 1) + min)
            };

            net.random_pickone = function(rand, arr) {
                return arr[net.random_integer(rand, 0, arr.length - 1)]
            }

            net.is_default_nick = function(nick) {
                return !isNaN(parseInt(nick)) && nick.indexOf('-') === 10;
            }

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
            }

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

            net.normalize = function(str) {
                var arr = Array.from(str);

                for (var i in arr) {
                    for (var j in normalize) {
                        // noinspection JSUnfilteredForInLoop
                        if (typeof normalize_data.mapping[normalize[j]][arr[i]] !== 'undefined') {
                            // noinspection JSUnfilteredForInLoop
                            arr[i] = normalize_data.mapping[normalize[j]][arr[i]];
                        }
                    }
                }

                return arr.join('');
            };

            /*net.htmlentities = function(str) {
            	return str.replace(/[\u00A0-\u9999<>&]/g, function(i) {
            		return '&#'+i.charCodeAt(0)+';';
            	});
            };*/

            net.remove_numbers = function(str) {
                return str.replace(/[0-9]/g, '');
            };

            net.remove_duplicates = function(str) {
                return str.replace(/(.)\1{6,}/gi, '$1');
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

            net.remove_spam = function(str) {
                // noinspection JSUnresolvedVariable
                for (var website in blacklist_data.mapping.en.website) {
                    // noinspection JSUnresolvedVariable,JSUnfilteredForInLoop
                    str = str.replace(new RegExp(blacklist_data.mapping.en.website[website], 'gi'), '');
                }

                // noinspection JSUnresolvedVariable
                for (var spam in blacklist_data.mapping.en.spam) {
                    // noinspection JSUnresolvedVariable,JSUnfilteredForInLoop
                    str = str.replace(new RegExp(blacklist_data.mapping.en.spam[spam], 'gi'), '');
                }

                return str.replace(/  +/g, ' ').trim();
            }

            // noinspection DuplicatedCode
            net.clean = function(str, emoji) {
                // noinspection JSUnresolvedFunction
                var subject = net.remove_zalgo(net.normalize(str));

                if (~net.client_room_name.text().indexOf('Emupedia')) {
                    subject = net.remove_profanity(net.remove_spam(net.remove_duplicates(net.remove_numbers(subject))));
                }

                if (typeof emoji === 'undefined') {
                    return twemoji.parse(net.str_replace(search, replace, subject), {}, emoticons_data.emoticons.mapping, {
                        folder: 'svg',
                        ext: '.svg'
                    });
                }

                return subject
            };

            // noinspection DuplicatedCode
            net.clean_nicknames = function(str, emoji) {
                // noinspection JSUnresolvedFunction
                var subject = net.remove_zalgo(str);

                if (~net.client_room_name.text().indexOf('Emupedia')) {
                    subject = net.remove_profanity(net.remove_spam(net.remove_duplicates(subject)));
                }

                if (typeof emoji === 'undefined') {
                    return twemoji.parse(net.str_replace(search, replace, subject), {}, emoticons_data.emoticons.mapping, {
                        folder: 'svg',
                        ext: '.svg'
                    });
                }

                return subject;
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

                net.output_div.append('<div class="' + msg_class + '" style="' + color + '">' + time_stamp + txt + '</div>');

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
                var is_admin = false;

                if (typeof net.room_info.data !== 'undefined' && typeof net.room_info.me !== 'undefined') {
                    if (typeof net.room_info.data.admins !== 'undefined') {
                        if (Array.isArray(net.room_info.data.admins)) {
                            if (net.room_info.data.admins.indexOf(net.room_info.me) !== -1) {
                                is_admin = true;
                            }
                        }
                    }
                }

                // noinspection JSUnresolvedFunction
                var msg = net.text_input.val();

                if (!is_admin) {
                    if (msg.length > 159) {
                        msg = msg.substring(0, 159)
                    }
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
                    if (data.cmd === 'nick' && data.data === '') {
                        return false;
                    }

                    // noinspection JSUnresolvedFunction
                    net.send_cmd(data.cmd, data.data);
                    net.text_input.val('');
                    return;
                } else if (~net.client_room_name.text().indexOf('Emupedia') && !is_admin) {
                    msg = net.remove_profanity(net.remove_spam(net.remove_duplicates(net.remove_numbers(net.remove_zalgo(net.normalize(msg))))));
                }

                if (msg.trim() === '') {
                    return false;
                }

                if (msg.trim().length <= 0) {
                    return false;
                }

                // noinspection JSUnresolvedVariable
                if (net.last_msg && !is_admin) {
                    if (net.last_msg === msg || ((~msg.indexOf(net.last_msg) || ~net.last_msg.indexOf(msg)) && msg.length >= 10)) {
                        net.log('You can\'t repeat yourself, write something different', 1);
                        return false;
                    }
                }

                if (net.last_last_msg && !is_admin) {
                    if (net.last_last_msg === msg || ((~msg.indexOf(net.last_last_msg) || ~net.last_last_msg.indexOf(msg)) && msg.length >= 10)) {
                        net.log('You can\'t repeat yourself, write something different', 1);
                        return false;
                    }
                }

                if (net.last_last_last_msg && !is_admin) {
                    if (net.last_last_last_msg === msg || ((~msg.indexOf(net.last_last_last_msg) || ~net.last_last_last_msg.indexOf(msg)) && msg.length >= 10)) {
                        net.log('You can\'t repeat yourself, write something different', 1);
                        return false;
                    }
                }

                var timestamp = Math.floor(Date.now() / 1000);

                if (!net.spam_cap || net.spam_cap < 0) {
                    net.spam_cap = 1;
                }

                if (net.last_send && !is_admin) {
                    if (timestamp - net.last_send < net.spam_cap) {
                        net.last_send = timestamp;
                        net.spam_cap++;
                        net.log('You are writing too fast, wait ' + net.spam_cap + ' second(s)', 1);
                        net.text_input.val('');
                        return false;
                    }
                }

                net.last_send = timestamp;

                // noinspection JSUnresolvedFunction
                net.send_cmd('room_msg', msg);
                net.last_last_last_msg = net.last_last_msg;
                net.last_last_msg = net.last_msg;
                net.last_msg = msg;
                net.spam_cap = 1;

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
                            net.send_cmd('set_room_data', { muted: false });
                            // noinspection JSUnresolvedFunction
                            net.send_cmd('set_room_data', { muted: muted });
                            return true;
                        case 'unmute':
                            var index = muted.indexOf(argz.data);

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
                net.log('You are now connected to the server', 1);
            });

            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            net.socket.on('disconnect', function() {
                // console.log('disconnect');
                net.log('You were disconnected from the server, trying to reconnect...', 1);
            });

            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            net.socket.on('auth.info', function(data) {
                // console.log('auth.info');
                // console.log(JSON.stringify(data, null, 2));

                // noinspection JSUnresolvedVariable
                if (data.login && !simplestorage.get('uid')) {
                    simplestorage.set('uid', data.login);
                }

                // noinspection JSUnresolvedVariable
                if (data.login === data.info.nick) {
                    net.log('Type /nick <nickname> to set your name', 0);
                }

                // noinspection JSUnresolvedFunction
                net.send_cmd('list', {});
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
                }
            });

            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            net.socket.on('room.info', function(data) {
                // console.log('room.info');
                // console.log(JSON.stringify(data, null, 2));
                net.room_info = data;

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

                    if (net.is_default_nick(nick)) {
                        users_array_default.push([user, nick]);
                    } else {
                        users_array_nick.push([user, nick]);
                    }
                }

                users_array_nick.sort(function(a, b) {
                    return a[1].localeCompare(b[1]);
                });

                users_array_default.sort();

                var users_obj = {};

                users_array_nick.forEach(function(item) {
                    users_obj[item[0]] = net.clean_nicknames(item[1]);
                });

                users_array_default.forEach(function(item) {
                    users_obj[item[0]] = net.friendly_name(item[1]);
                });

                // noinspection JSUnresolvedVariable
                for (var u in users_obj) {
                    // noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
                    var color = u !== me ? net.colors[3] : net.colors[1];
                    var glow = '';

                    if (typeof net.room_info !== 'undefined') {
                        // noinspection JSUnresolvedVariable
                        var room_user = net.room_info.users[u] || false;
                        // noinspection JSUnresolvedVariable,DuplicatedCode
                        if (room_user && room_user.info.present && room_user.info.present.item_index !== -1 && room_user.info.present.items[room_user.info.present.item_index]) {
                            // noinspection JSUnresolvedVariable
                            if (room_user.info.present.items[room_user.info.present.item_index].color) {
                                // noinspection JSUnresolvedVariable
                                color = room_user.info.present.items[room_user.info.present.item_index].color;
                            }
                        } else {
                            console.log(room_user.info)
                        }

                        if (typeof net.room_info.data !== 'undefined') {
                            if (typeof net.room_info.data.admins !== 'undefined') {
                                if (Array.isArray(net.room_info.data.admins)) {
                                    if (net.room_info.data.admins.length > 0) {
                                        if (net.room_info.data.admins.indexOf(u) !== -1) {
                                            glow = 'class="glow"';
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
                    users_list += '<div id="room_user_' + u + '" ' + glow + ' style="color: ' + (glow ? '#4c4c4c' : color) + '; word-break: keep-all; --glow-color-1: ' + color + '; --glow-color-2: ' + net.increase_brightness(color, 20) + ';" title="' + u + '" data-title="' + u + '">' + users_obj[u] + '</div>';
                }

                // noinspection JSUnresolvedVariable
                net.text_input.attr('placeholder', 'You are typing as "' + (net.is_default_nick(net.room_info.users[net.room_info.me].info.nick) ? net.friendly_name(net.room_info.users[net.room_info.me].info.nick) : net.clean_nicknames(net.room_info.users[net.room_info.me].info.nick, true)) + '". To change nick, type /nick and your new nickname.');
                // noinspection JSUnresolvedFunction
                net.client_room_users.html(users_list);
                // noinspection JSUnresolvedFunction
                net.client_room_name.text(room);
                // noinspection JSUnresolvedVariable
                net.client_room_online.text(users_online);
                // noinspection JSUnresolvedFunction
                net.output_div.html('');
                net.log('You are now chatting in ' + room + ' with ' + users_online + ' users', 1);
                // noinspection JSUnresolvedVariable
                $('.ui-selectmenu-text').text(room + ' (' + users_online + ' users)');
            });

            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            net.socket.on('room.data', function(data) {
                // console.log('room.data');
                // console.log(JSON.stringify(data, null, 2));

                if (typeof net.room_info.data.admins !== 'undefined') {
                    if (Array.isArray(net.room_info.data.admins)) {
                        $('#client_room_users > div').removeClass('glow');

                        if (net.admins.length !== JSON.parse(JSON.stringify(net.room_info.data.admins)).length) {
                            net.admins = JSON.parse(JSON.stringify(net.room_info.data.admins));

                            if (typeof net.admins !== 'undefined') {
                                if (Array.isArray(net.admins)) {
                                    for (var a2 in net.admins) {
                                        // noinspection JSUnfilteredForInLoop
                                        if (typeof net.admins[a2] !== 'undefined') {
                                            // noinspection JSUnfilteredForInLoop
                                            $('#room_user_' + net.admins[a2]).css('color', '#4c4c4c').addClass('glow');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                net.room_info.data = $.extend(net.room_info.data, data.data);
            });

            // noinspection JSUnresolvedFunction,JSUnresolvedVariable,DuplicatedCode
            net.socket.on('room.user_join', function(data) {
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

                var color = net.colors[3];
                var glow = '';

                // noinspection JSUnresolvedFunction,JSUnresolvedVariable,DuplicatedCode
                if (typeof net.room_info !== 'undefined') {
                    // noinspection JSUnresolvedVariable
                    var room_user = net.room_info.users[data.user] || false;
                    // noinspection JSUnresolvedVariable,DuplicatedCode
                    if (room_user && room_user.info.present && room_user.info.present.item_index !== -1 && room_user.info.present.items[room_user.info.present.item_index]) {
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
                                    if (net.room_info.data.admins.indexOf(data.data.info.user) !== -1) {
                                        glow = 'class="glow"'
                                    }
                                }
                            }
                        }
                    }
                }

                // noinspection JSUnresolvedVariable
                net.client_room_users.append('<div id="room_user_' + data.data.info.user + '" ' + glow + ' style="color: ' + (glow ? '#4c4c4c' : color) + '; word-break: keep-all;  --glow-color-1: ' + color + '; --glow-color-2: ' + net.increase_brightness(color, 20) + ';" title="' + data.data.info.user + '" data-title="' + data.data.info.user + '">' + (net.is_default_nick(data.data.info.nick) ? net.friendly_name(data.data.info.nick) : net.clean_nicknames(data.data.info.nick)) + '</div>');
            });

            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            net.socket.on('room.user_leave', function(data) {
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
                    // noinspection JSUnresolvedFunction,JSValidateTypes
                    $el.slideUp(200, function() {
                        $(this).remove();
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

                var user = data.user;
                var nick = '';

                // noinspection JSUnresolvedVariable
                if (typeof net.room_info !== 'undefined' && typeof net.room_info.users[user] !== 'undefined' && typeof net.room_info.users[user].info !== 'undefined' && typeof net.room_info.users[user].info.nick !== 'undefined') {
                    // noinspection JSUnresolvedVariable
                    nick = net.is_default_nick(net.room_info.users[user].info.nick) ? net.friendly_name(net.room_info.users[user].info.nick) : net.clean_nicknames(net.room_info.users[user].info.nick);
                }

                var color = net.colors[3];
                var glow = '';

                // noinspection JSUnresolvedFunction,JSUnresolvedVariable,DuplicatedCode
                if (typeof net.room_info !== 'undefined') {
                    // noinspection JSUnresolvedVariable
                    var room_user = net.room_info.users[data.user] || false;
                    // noinspection JSUnresolvedVariable,DuplicatedCode
                    if (room_user && room_user.info.present && room_user.info.present.item_index !== -1 && room_user.info.present.items[room_user.info.present.item_index]) {
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
                                    if (net.room_info.data.admins.indexOf(data.user) !== -1) {
                                        glow = 'class="glow"';
                                    }
                                }
                            }
                        }
                    }
                }

                if (data.msg.length > 159) {
                    data.msg = data.msg.substring(0, 159);
                }

                // noinspection JSUnresolvedVariable
                net.log('<span ' + glow + ' style="color: ' + (glow ? '#4c4c4c' : color) + '; overflow: hidden; --glow-color-1: ' + color + '; --glow-color-2: ' + net.increase_brightness(color, 20) + ';" title="' + user + '">[' + nick + '] </span>' + (glow ? data.msg : net.clean(data.msg)));
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

                        // noinspection JSUnresolvedVariable
                        if (data.info.nick) {
                            // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                            $('#room_user_' + data.user).attr('data-title', data.user).data('title', data.user).html(net.is_default_nick(data.info.nick) ? net.friendly_name(data.info.nick) : net.clean_nicknames(data.info.nick));
                        }

                        // noinspection JSUnresolvedVariable
                        if (data.info.present && data.info.present.item_index !== -1) {
                            // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                            var present = data.info.present.items[data.info.present.item_index]

                            if (present.color) {
                                // noinspection JSJQueryEfficiency
                                $('#room_user_' + data.user).css('color', $('#room_user_' + data.user).hasClass('glow') ? '#4c4c4c' : present.color).css('--glow-color-1', present.color).css('--glow-color-2', net.increase_brightness(present.color, 20));
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

                        var html = '';
                        // noinspection JSUnresolvedVariable
                        if (data.claimable) {
                            var label = (data.custom_color) ? '<input type="color" id="custom_color" /> Claim a CUSTOM color! ' : '🎁 Click here to claim a new color!';
                            html += '<a href="javascript:;" class="color-claim" style="color: orange; text-decoration: none;">' + label + ' 🎁</a><hr />';
                        }

                        //html += '<a href="javascript:;" class="color" style="color: #4c4c4c; text-decoration: none;" data-index="0" data-color="#4c4c4c">Default Color</a>';

                        var i = 1;
                        var last_color = '#000000';
                        for (var item in data.items) {
                            // noinspection JSUnfilteredForInLoop
                            html += '<a href="javascript:;" class="color" style="color: ' + data.items[item].color + '; text-decoration: none;" data-index="' + i + '" data-color="' + data.items[item].color + '">Color ' + i + '</a>';
                            i++;
                            last_color = data.items[item].color;
                        }

                        net.color_popover.html(html);
                        if (data.claimable && data.custom_color) {
                            $('#custom_color').spectrum({
                                appendTo: '#client_color_popover',
                                allowEmpty: true,
                                color: last_color,
                            }).on('change', function(e, color) {
                                //net.color_popover.removeClass('show');
                                net.send_cmd('present', color.toHexString());
                            });
                        }
                    }

                    net.color_popover_instance.update();

                    if (!net.color_popover.hasClass('show')) {
                        net.color_popover.css('visibility', 'visible');
                        net.color_popover.addClass('show');
                    } else {
                        net.color_popover.removeClass('show');
                        setTimeout(function() {
                            net.color_popover.css('visibility', 'hidden');
                        }, 200);
                    }
                }
            });

            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            net.socket.on('server.help', function(data) {
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

            net.socket.on('chat.show', function() {
                var output = net.output_div.get(0);
                output.scrollTop = output.scrollHeight;
                net.text_input.get(0).focus();
            });

            var chat_ui = '<div id="client_container" class="client_decoration">' +
                '<div id="client_output" class="client_decoration client_left"></div>' +
                '<div id="client_users" class="client_right">' +
                '<div id="client_room" class="client_decoration ui-widget"><select id="client_rooms" class="client_rooms"></select><span class="name"></span> (<span class="online">0</span> users)</div>' +
                '<div id="client_room_users" class="client_decoration"></div>' +
                '</div>' +
                '<div id="client_color_popover" style="min-height:250px;"></div>' +
                '<div id="client_input" class="client_decoration">' +
                '<button id="client_emoticons">😀</button><button id="client_colors">🎨</button><input id="client_command" type="text" placeholder="To change nick, type /nick and your new nickname." autofocus="autofocus" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="160" /><button id="client_command_send">Send</button>' +
                '</div>' +
                '</div>';

            $body.append(chat_ui);

            net.console = $('#client_container');
            net.emoji_button = $('#client_emoticons');
            net.color_button = $('#client_colors');
            net.color_popover = $('#client_color_popover');
            net.text_input = $('#client_command');
            net.text_input_button = $('#client_command_send');
            net.output_div = $('#client_output');
            net.client_room_users = $('#client_room_users');
            net.client_room = $('#client_room');
            net.client_rooms = $('#client_rooms');
            net.client_room_name = net.client_room.find('span.name');
            net.client_room_online = net.client_room.find('span.online');
            // noinspection JSUnresolvedFunction
            net.text_input.off('keypress').on('keypress', function(e) {
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
            }).off('paste').on('paste', function(e) {
                if (typeof e.originalEvent.clipboardData !== 'undefined') {
                    if (typeof e.originalEvent.clipboardData.getData === 'function') {
                        var paste = e.originalEvent.clipboardData.getData('text');

                        if (net.text_input.val().length + paste.length > 50) {
                            e.preventDefault();
                            return false;
                        }
                    }
                }
            });

            // noinspection JSUnresolvedFunction
            net.text_input_button.off('click').on('click', function() {
                net.send_input();
            })

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
        });
    });
}(this));