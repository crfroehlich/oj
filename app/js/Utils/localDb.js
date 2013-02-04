/*global OJ:true*/
(function() {

	var init = function() {
		'use strict';
		var initObj = {
			keys: [],
			deserialize: OJ.deserialize,
			serializer: OJ.serialize,
			hasLocalStorage: (window.Modernizr.localstorage),
			hasSessionStorage: (window.Modernizr.sessionstorage)
		};
		initObj.serialize = initObj.serializer.stringify;
	};
	var ojInternal;

    var hasWebStorage = function () {
        'use strict';
        ojInternal.hasLocalStorage = (window.Modernizr.localstorage || window.Modernizr.sessionstorage);
		return ojInternal || (window.Modernizr.localstorage || window.Modernizr.sessionstorage);
    };

	OJ.makeSubNameSpace('localDb');


    OJ.localDb.lift('clear', function (clearAll) {
        'use strict';
        ojInternal = ojInternal || init();
			if (OJ.bool(clearAll)) {
                //nuke the entire storage collection
                if (ojInternal.hasLocalStorage) {
                    window.localStorage.clear();
                }
                if (ojInternal.hasSessionStorage) {
                    window.sessionStorage.clear();
                }
                ojInternal.closureStorage.clear();
            } else {
                ojInternal.keys.forEach(function (key) {
                    OJ.localDb.removeItem(key);
                });
            }
            return OJ.localDb;
     });

    OJ.localDb.lift('getItem',  function (key) {
		'use strict';
		ojInternal = ojInternal || init();
		var ret = '';
		if (false === OJ.is.nullOrEmpty(key)) {
			var value = OJ.string(window.localStorage.getItem(key));
			if (OJ.is.nullOrEmpty(value) || value === 'undefined') {
				value = OJ.string(window.sessionStorage.getItem(key));
			}
			if (!OJ.is.nullOrEmpty(value) && value !== 'undefined') {
				try {
					ret = ojInternal.deserialize(value);
				} catch (e) {
					ret = value;
				}
			}
		}
		return ret;
    });

    OJ.localDb.lift('getKeys',  function () {
		'use strict';
		ojInternal = ojInternal || init();
		if (OJ.is.nullOrEmpty(ojInternal.keys) && window.localStorage.length > 0) {
			Object.keys(window.localStorage).forEach(function(key) {
				ojInternal.keys.push(key);
			});
			if (window.sessionStorage.length > 0) {
				Object.keys(window.sessionStorage).forEach(function(key) {
					ojInternal.keys.push(key);
				});
			}
		}
		return ojInternal.keys;
	});

    OJ.localDb.lift('hasKey',  function (key) {
		'use strict';
		ojInternal = ojInternal || init();
		var ret = OJ.contains(OJ.localDb.getKeys(), key);
		return ret;
	});

    OJ.localDb.lift('removeItem', function (key) {
		'use strict';
		window.localStorage.removeItem(key);
		window.sessionStorage.removeItem(key);
		delete ojInternal.keys[key];
	});

    OJ.localDb.lift('setItem', function (key, value) {
		'use strict';
		var ret = true;
		if (false === OJ.isNullOrEmpty(key)) {
			if (false === OJ.localDb.hasKey(key)) {
				ojInternal.keys.push(key);
			}
			var val = (typeof value === 'object') ? ojInternal.serialize(value) : value;

			try {
				window.localStorage.setItem(key, val);
			} catch (locErr) {
				try {
					window.localStorage.removeItem(key);
					window.sessionStorage.setItem(key, val);
				} catch (ssnErr) {
					try {
						window.sessionStorage.removeItem(key);
					} catch (memErr) {
						ret = false;
					}
				}
			}
		}
		return ret;
    });

}());