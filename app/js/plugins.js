// Avoid `console` errors in browsers that lack a console.
(function() {
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];

    var console = (window.console = window.console || {});

    methods.forEach(function(method) {
		// Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    });

}());

// (function() {
//     var noop = function () {};
//     var methods = [
//         'isFinite', 'isNaN', 'NaN', 'MAX_VALUE', 'MIN_VALUE'
//     ];

//     var number = (window.Number = window.Number || {});

//     methods.forEach(function(method) {
//         // Only stub undefined methods.
//         var nu = noop;
//         if (!number[method]) {
//             switch(method) {
//                 case 'NaN':
//                     nu = window.NaN;
//                     break;
//                 case 'isNaN':
//                     nu = window.isNaN;
//                     break;
//                 case 'isFinite':
//                     nu = window.isFinite;
//                     break;
//                 case 'MAX_VALUE':
//                     nu = 1.7976931348623157e+308;
//                     break;
//                 case 'MIN_VALUE':
//                     nu = 5e-324;
//                     break;
//             }
//             number[method] = noop;
//         }
//     });

// }());



// Place any jQuery/helper plugins in here.
