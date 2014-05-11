


(function () {
    'use strict';
    /// 
    ///   Client db class to encapsulate get/set/update and delete methods against the localStorage object.
    /// 
    ///  type="OJClientDb">Instance of itself. Must instance with 'new' keyword.

    var ojInternal = {
        keys: [],
        deserialize: $.parseJSON,
        serializer: JSON,
        hasLocalStorage: (window.Modernizr.localstorage),
        hasSessionStorage: (window.Modernizr.sessionstorage)
    };
    ojInternal.serialize = ojInternal.serializer.stringify;

    ojInternal.closureStorage = (function () {
        var storage = {},
            keys = [],
            length = 0;
        var clientDbP = {};
        clientDbP.getItem = function (sKey) {
            var ret = null;
            if (sKey && storage.hasOwnProperty(sKey)) {
                ret = storage[sKey];
            }
            return ret;
        };
        clientDbP.key = function (nKeyId) {
            var ret = null;
            if (keys.hasOwnProperty(nKeyId)) {
                ret = keys[nKeyId];
            }
            return ret;
        };
        clientDbP.setItem = function (sKey, sValue) {
            var ret = null;
            if (sKey) {
                if (false === storage.hasOwnProperty(sKey)) {
                    keys.push(sKey);
                    length += 1;
                }
                storage[sKey] = sValue;
            }
            return ret;
        };
        clientDbP.length = length;
        clientDbP.removeItem = function (sKey) {
            var ret = false;
            if (sKey && storage.hasOwnProperty(sKey)) {
                keys.splice(sKey, 1);
                length -= 1;
                delete storage[sKey];
                ret = true;
            }
            return ret;
        };
        clientDbP.clear = function () {
            storage = {};
            keys = [];
            length = 0;
            return true;
        };
        clientDbP.hasOwnProperty = function (sKey) {
            return storage.hasOwnProperty(sKey);
        };

        return clientDbP;
    }());


    OJ.register('hasWebStorage', function () {
        var ret = (window.Modernizr.localstorage || window.Modernizr.sessionstorage);
        return ret;
    });

    OJ.clientDb.register('clear', function (clearAll) {
        if (OJ.to.bool(clearAll)) {
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
                OJ.clientDb.removeItem(key);
            });
        }
        return OJ.clientDb;
    });

    OJ.clientDb.register('getItem', function (key) {
        var ret = '';
        if (false === OJ.is.nullOrEmpty(key)) {
            var value = OJ.to.string(window.localStorage.getItem(key));
            if (OJ.is.nullOrEmpty(value) || value === 'undefined') {
                value = OJ.to.string(window.sessionStorage.getItem(key));
            }
            if (OJ.is.nullOrEmpty(value) || value === 'undefined') {
                value = OJ.to.string(ojInternal.closureStorage.getItem(key));
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

    OJ.clientDb.register('getKeys', function () {
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
            if (ojInternal.closureStorage.length > 0) {
                for (memKey in ojInternal.closureStorage.keys) {
                    ojInternal.keys.push(memKey);
                }
            }
        }
        return ojInternal.keys;
    });

    OJ.clientDb.register('hasKey', function (key) {
        var ret = OJ.contains(this.getKeys(), key);
        return ret;
    });

    OJ.clientDb.register('removeItem', function (key) {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
        ojInternal.closureStorage.removeItem(key);
        delete ojInternal.keys[key];
    });

    OJ.clientDb.register('setItem', function (key, value) {
        /// 
        ///   Stores a key/value pair in localStorage. 
        ///   If localStorage is full, use sessionStorage. 
        ///   if sessionStorage is full, store in memory.
        /// 
        ///  name="key" type="String">The property name to store.
        ///  The property value to store. If not a string, serializer will be called.
        ///  type="Boolean">True if successful
        var ret = true;
        if (false === OJ.is.nullOrEmpty(key)) {
            if (false === this.hasKey(key)) {
                ojInternal.keys.push(key);
            }
            var val = (typeof value === 'object') ? ojInternal.serialize(value) : value;

            // if localStorage is full, we should fail gracefully into sessionStorage, then memory
            try {
                window.localStorage.setItem(key, val);
            } catch (locErr) {
                try {
                    window.localStorage.removeItem(key);
                    window.sessionStorage.setItem(key, val);
                } catch (ssnErr) {
                    try {
                        window.sessionStorage.removeItem(key);
                        ojInternal.closureStorage.setItem(key, value);
                    } catch (memErr) {
                        ret = false;
                    }
                }
            }
        }
        return ret;
    });


}());
