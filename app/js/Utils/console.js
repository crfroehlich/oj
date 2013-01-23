(function () {
    'use strict';
    
    var ojInteral = {
        prepMsg: function (msg) {
            var ret = {};
            var data = msg || { };
            if (window.internetExplorerVersionNo > -1) {
                if (false === OJ.isPlainObject(data)) {
                    data = { message: OJ.string(data) }; 
                } 
            }
            ret.customerid = ret.customerid || OJ.clientSession.currentAccessId();
            ret.username = ret.username || OJ.clientSession.currentUserName();
            ret.sessionid = ret.sessionid || OJ.clientSession.currentSessionId();
            ret.server = ret.server || OJ.clientSession.currentServer();
            ret.data = data;
            return ret;
        },
        logLevels: ['info','performance','warn','error','none']
    };

    var ojReturn = {
        loggly: {
            info: function () { },
            perf: function () {},
            warn: function () {},
            error: function () {}
        }
    };

    ojInteral.prepareLoggly = OJ.method(function(url) {
        ojReturn.loggly = ojReturn.loggly || { };
        ojReturn.loggly.info = new window.loggly({ url: url, level: 'log' });
        ojReturn.loggly.perf = new window.loggly({ url: url, level: 'debug' });
        ojReturn.loggly.warn = new window.loggly({ url: url, level: 'warn' });
        ojReturn.loggly.error = new window.loggly({ url: url, level: 'error' });
    });

    ojInteral.initLoggly = function(keepTrying) {
        try {
            var key = OJ.clientSession.getLogglyInput();
            var host = ("https:" == document.location.protocol) ? "https://logs.loggly.com" : 'http://logs.loggly.com';
            var url = host + '/inputs/' + key + '?rt=1';
            if (loggly) {
                ojInteral.prepareLoggly(url);
            } else {
                window.setTimeout(function () {
                    ojInteral.initLoggly();
                }, 5000);
            }
        } catch(e) {
            //This kludge is for Dev. getLogglyInput() won't fail in compiled code.
            if (keepTrying !== false) {
                window.setTimeout(function () {
                    ojInteral.initLoggly(false);
                }, 5000);
            }
        }
    };
    ojInteral.initLoggly();

    ojInteral.isLogLevelSupported = function (requestLevel) {
        var maxLevel = OJ.clientSession.getLogglyLevel();
        return ojInteral.logLevels.indexOf(maxLevel) <= ojInteral.logLevels.indexOf(requestLevel);
    };

    ojReturn.showExceptions = function() {
        return (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('error'));
    };

    ojReturn.logLevels = function() {
        return ojInteral.logLevels.slice(0);
    };

    ojReturn.assert = function (truth, msg) {
        if (OJ.clientSession.isDebug()) {
            ojInteral.tryExecSwallow(
                function first() {
                    console.assert(truth, msg);
                }
            );
        }
    };

    ojReturn.count = function (msg) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    console.count(msg);
                }
            );
        }
    };

    ojInteral.tryExecSwallow = function(first, second, third) {
        var failed = false;
        try {
            first();
        } catch(e) {
            failed = true;
        }
        try {
            second();
        } catch(e) {
            failed = true;
        }
        if (failed) {
            try {
                third();
            } catch(e) {
                
            }
        }
    };

    ojReturn.error = function (msg) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('error')) {
            ojInteral.tryExecSwallow(
                function first() {
                    console.error(msg);
                },
                function second() {
                    msg = ojInteral.prepMsg(msg);
                    msg.type = 'Error';
                    OJ.console.loggly.error.error(OJ.serialize(msg));
                },
                function third() {
                    OJ.console.log(msg);
                }
            );
        }
    };

    ojReturn.group = function (name) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    name = name || '';
                    console.group(name);
                }
            );
        }
    };

    ojReturn.groupCollapsed = function (name) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    name = name || '';
                    console.groupCollapsed(name);
                }
            );
        }
    };

    ojReturn.groupEnd = function (name) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    name = name || '';
                    console.groupEnd(name);
                }
            );
        }
    };

    ojReturn.perf = function (msg) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    console.info(msg);
                },
                function second() {
                    msg = ojInteral.prepMsg(msg);
                    msg.type = 'Performance';
                    OJ.console.loggly.perf.info(OJ.serialize(msg));
                },
                function third() {
                    OJ.console.log(msg);
                }
            );
        }
    };

    ojReturn.log = function (msg) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('info')) {
            ojInteral.tryExecSwallow(
                function first() {
                    console.log(msg);
                },
                function second() {
                    msg = ojInteral.prepMsg(msg);
                    msg.type = 'Info';
                    OJ.console.loggly.info.console(OJ.serialize(msg));
                },
                function third() {
                    window.dump(msg);
                }
            );
        }
    };

    ojReturn.profile = function (name) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    name = name || '';
                    if (window.internetExplorerVersionNo === -1) {
                        console.profile(name);
                    }
                }
            );
        }
    };

    ojReturn.profileEnd = function (name) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    name = name || '';
                    if (window.internetExplorerVersionNo === -1) {
                        console.profileEnd(name);
                    }
                }
            );
        }
    };

    ojReturn.time = function (name) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    name = name || '';
                    console.time(name);
                }
            );
        }
    };

    ojReturn.timeEnd = function (name) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    name = name || '';
                    console.timeEnd(name);
                }
            );
        }
    };
    ojReturn.trace = function () {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('performance')) {
            ojInteral.tryExecSwallow(
                function first() {
                    console.trace();
                }
            );
        }
    };

    ojReturn.warn = function (msg) {
        if (OJ.clientSession.isDebug() || ojInteral.isLogLevelSupported('warn')) {
            ojInteral.tryExecSwallow(
                function first() {
                    console.warn(msg);
                },
                function second() {
                    msg = ojInteral.prepMsg(msg);
                    msg.type = 'Warning';
                    OJ.console.loggly.warn.warn(OJ.serialize(msg));
                },
                function third() {
                    OJ.console.log(msg);
                }
            );
        }
    };

    OJ.console = OJ.console ||
        OJ.register('debug', ojReturn);
		
}());