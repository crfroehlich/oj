/*global OJ:true,window:true*/
(function () {
    'use strict';

    OJ.makeSubNameSpace('console');

    OJ.console.lift('assert', function (truth, msg) {
        window.console.assert(truth, msg);
    });

    OJ.console.lift('count', function (msg) {
        window.console.count(msg);
    });

    OJ.console.lift('error', function (msg) {
        window.console.error(msg);
    });

    OJ.console.lift('group', function (name) {
        window.console.group(name);
    });

    OJ.console.lift('groupCollapsed', function (name) {
        window.console.groupCollapsed(name);
    });

    OJ.console.lift('groupEnd', function (name) {
        window.console.groupEnd(name);
    });

    OJ.console.lift('info', function (msg) {
        window.console.info(msg);
    });

    OJ.console.lift('log', function (msg) {
        window.console.log(msg);
    });

    OJ.console.lift('profile', function (msg) {
        window.console.profile(msg);
    });

    OJ.console.lift('profileEnd', function (msg) {
        window.console.profileEnd(msg);
    });

    OJ.console.lift('time', function (msg) {
        window.console.time(msg);
    });

    OJ.console.lift('timeEnd', function (msg) {
        window.console.timeEnd(msg);
    });

    OJ.console.lift('trace', function (msg) {
        window.console.trace(msg);
    });

    OJ.console.lift('warn', function (msg) {
        window.console.warn(msg);
    });

}());