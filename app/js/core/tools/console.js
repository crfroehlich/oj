/*global n$:true,window:true*/
(function (n$) {
    'use strict';

    var method;
    var noop = function () { };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    n$.makeSubNameSpace('console');

    n$.console.lift('assert', function () {
        'use strict';
        window.console.assert.apply(this, arguments);
    });

    n$.console.lift('count', function () {
        'use strict';
        window.console.count.apply(this, arguments);
    });

    n$.console.lift('error', function () {
        'use strict';
        window.console.error.apply(this, arguments);
    });

    n$.console.lift('group', function () {
        'use strict';
        window.console.group.apply(this, arguments);
    });

    n$.console.lift('groupCollapsed', function () {
        'use strict';
        window.console.groupCollapsed.apply(this, arguments);
    });

    n$.console.lift('groupEnd', function (name) {
        'use strict';
        window.console.groupEnd.apply(this, arguments);
    });

    n$.console.lift('info', function (msg) {
        'use strict';
        window.console.info.apply(this, arguments);
    });

    n$.console.lift('log', function (msg) {
        'use strict';
        window.console.log.apply(this, arguments);
    });

    n$.console.lift('profile', function (msg) {
        'use strict';
        window.console.profile.apply(this, arguments);
    });

    n$.console.lift('profileEnd', function (msg) {
        'use strict';
        window.console.profileEnd.apply(this, arguments);
    });

    n$.console.lift('table', function (msg) {
        'use strict';
        window.console.table.apply(this, arguments);
    });

    n$.console.lift('time', function (msg) {
        'use strict';
        window.console.time.apply(this, arguments);
    });

    n$.console.lift('timeEnd', function (msg) {
        'use strict';
        window.console.timeEnd.apply(this, arguments);
    });

    n$.console.lift('trace', function (msg) {
        'use strict';
        window.console.trace.apply(this, arguments);
    });

    n$.console.lift('warn', function (msg) {
        'use strict';
        window.console.warn.apply(this, arguments);
    });

}(window.$nameSpace$));
