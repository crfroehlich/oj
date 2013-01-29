/*global OJ:true,window:true*/
(function () {
    'use strict';

    OJ.makeSubNameSpace('console');

    OJ.console.lift('assert', OJ.method(function (truth, msg) {
        window.console.assert(truth, msg);
    }));

    OJ.console.lift('count', OJ.method(function (msg) {
        window.console.count(msg);
    }));

    OJ.console.lift('error', OJ.method(function (msg) {
        window.console.error(msg);
    }));

    OJ.console.lift('group', OJ.method(function (name) {
        window.console.group(name);
    }));

    OJ.console.lift('groupCollapsed', OJ.method(function (name) {
        window.console.groupCollapsed(name);
    }));

    OJ.console.lift('groupEnd', OJ.method(function (name) {
        window.console.groupEnd(name);
    }));

    OJ.console.lift('info', OJ.method(function (msg) {
        window.console.info(msg);
    }));

    OJ.console.lift('log', OJ.method(function (msg) {
        window.console.log(msg);
    }));

    OJ.console.lift('profile', OJ.method(function (msg) {
        window.console.profile(msg);
    }));

    OJ.console.lift('profileEnd', OJ.method(function (msg) {
        window.console.profileEnd(msg);
    }));

    OJ.console.lift('time', OJ.method(function (msg) {
        window.console.time(msg);
    }));

    OJ.console.lift('timeEnd', OJ.method(function (msg) {
        window.console.timeEnd(msg);
    }));

    OJ.console.lift('trace', OJ.method(function (msg) {
        window.console.trace(msg);
    }));

    OJ.console.lift('warn', OJ.method(function (msg) {
        window.console.warn(msg);
    }));

}());