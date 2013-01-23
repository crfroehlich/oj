(function() {

	var init = function() {
		var initObj = {
			keys: [],
			deserialize: OJ.deserialize,
			serializer: O,
			hasLocalStorage: (window.Modernizr.localstorage),
			hasSessionStorage: (window.Modernizr.sessionstorage)
		};
		initObj.serialize = initObj.serializer.stringify;
	};
	var ojInternal;
    
    var hasWebStorage = function () {
            ojInternal.hasLocalStorage = (window.Modernizr.localstorage || window.Modernizr.sessionstorage);
			return ojInternal || (window.Modernizr.localstorage || window.Modernizr.sessionstorage);
    };

	OJ.makeSubNameSpace('localDb');


    OJ.localDb.lift('clear', function (clearAll) {
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
		ojInternal = ojInternal || init();
		var locKey, sesKey, memKey;
		if (OJ.is.nullOrEmpty(ojInternal.keys) && window.localStorage.length > 0) {
			for (locKey in window.localStorage) {
				ojInternal.keys.push(locKey);
			}
			if (window.sessionStorage.length > 0) {
				for (sesKey in window.sessionStorage) {
					ojInternal.keys.push(sesKey);
				}
			}
		}
		return ojInternal.keys;
	});

    OJ.localDb.lift('hasKey',  function (key) {
		ojInternal = ojInternal || init();
		var ret = OJ.contains(OJ.localDb.getKeys(), key);
		return ret;
	});

    OJ.localDb.lift('removeItem', function (key) {
		window.localStorage.removeItem(key);
		window.sessionStorage.removeItem(key);
		delete ojInternal.keys[key];
	});

    OJ.localDb.lift('setItem', function (key, value) {
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