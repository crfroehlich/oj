/*global OJ:true*/
(function () {
    'use strict';
    
    OJ.makeSubNameSpace('console');

    OJ.console.lift('assert', OJ.method(function (truth, msg) {
        console.assert(truth, msg);
    }));

    OJ.console.lift('count', OJ.method(function (msg) {
        console.count(msg);
    }));
    
    OJ.console.lift('error', OJ.method(function (msg) {
        console.error(msg);
    }));

    OJ.console.lift('group', OJ.method(function (name) {
        console.group(name);
    }));

    OJ.console.lift('groupCollapsed', OJ.method(function (name) {
        console.groupCollapsed(name);
    }));

    OJ.console.lift('groupEnd', OJ.method(function (name) {
        console.groupEnd(name);
    }));

    OJ.console.lift('info', OJ.method(function (msg) {
        console.info(msg);
    }));

    OJ.console.lift('log', OJ.method(function (msg) {
        console.log(msg);
    }));

    OJ.console.lift('profile', OJ.method(function (msg) {
        console.profile(msg);
    }));

    OJ.console.lift('profileEnd', OJ.method(function (msg) {
        console.profileEnd(msg);
    }));

    OJ.console.lift('time', OJ.method(function (msg) {
        console.time(msg);
    }));

    OJ.console.lift('timeEnd', OJ.method(function (msg) {
        console.timeEnd(msg);
    }));

    OJ.console.lift('trace', OJ.method(function (msg) {
        console.trace(msg);
    }));

    OJ.console.lift('warn', OJ.method(function (msg) {
        console.warn(msg);
    }));
	
}());