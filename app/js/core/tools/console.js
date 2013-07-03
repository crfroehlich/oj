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

    //stub out any missing methods. If the stubs execute, it's almost certainly in a browser I don't care about.
    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    n$.makeSubNameSpace('console');

    //Begin KLUDGE. What we really want to do is call window.console[methodName].apply(this, arguments); but
    //but this generates an exception, which is not at all expected. So to kludge these wrappers into being,
    //Accept a list of parameters from a-p--because who would ever need more than 16 parameters?
    n$.console.register('assert', function assert(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.assert(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('count', function count(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.count(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('error', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.error(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('group', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.group(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('groupCollapsed', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.groupCollapsed(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('groupEnd', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.groupEnd(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('info', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.info(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('log', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.log(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('profile', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.profile(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('profileEnd', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.profileEnd(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('table', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.table(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('time', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.time(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('timeEnd', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.timeEnd(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('trace', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.trace(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

    n$.console.register('warn', function (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p) {
        'use strict';
        window.console.warn(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
    });

}(window.$nameSpace$));
