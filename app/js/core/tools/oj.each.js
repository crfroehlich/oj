/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function() {

    /**
     * True if the object is a true Object or Array
     * @param obj {Object}
    */
    var canEach = function(obj) {
        return (obj && (typeof obj === 'object' || Array.isArray(obj)));
    }

    /**
     * Iterate an object with optional callBack and recursion
     * @param obj {Object} an Object to iterate
     * @param onEach {Function} [onEach=undefined] call back to exec
     * @param recursive {Boolean} if true, recurse the object
    */
    var each = function(obj, onEach, recursive) {
        if (canEach(obj)) {
            Object.keys(obj).forEach(function (key) {
                var val = obj[key];
                if (onEach && key) {
                    var quit = onEach(val, key);
                    if (false === quit) {
                        return false;
                    }
                }
                if (true === recursive) {
                    each(val, onEach, true);
                }
            });
        }


    }

    OJ.lift('each', each);

    }());