/*global n$:true*/
(function (n$) {

    n$.register('hasLength',
        /**
         * True if the Object has an Array-like length property
        */
        function hasLength(obj) {
            'use strict';
            var ret = (n$.is.array(obj) || n$.is.jQuery(obj));
            return ret;
        });

    n$.register('contains',
        /*
         * True if the Object has a property by name, excluding the properties on the Object's prototype
        */
        function contains(object, index) {
            'use strict';
            var ret = false;
            if (false === n$.is.nullOrUndefined(object)) {
                if (n$.is.array(object)) {
                    ret = object.indexOf(index) !== -1;
                }
                if (false === ret && object.hasOwnProperty(index)) {
                    ret = true;
                }
            }
            return ret;
        });

    n$.register('clone',
        /**
         * Convert an Object to a String to an Object to get a dereferenced copy.
        */
        function (data) {
            'use strict';
            return n$.deserialize(n$.serialize(data));
        });

    n$.register('serialize',
        /**
         * Convert an Object to a String
        */
        function serialize(data) {
            'use strict';
            var ret = '';
            n$.tryExec(function () { ret = JSON.stringify(data); });
            return ret;
        });


    n$.register('deserialize',
        /**
         * Convert a string into an Object
        */
        function deserialize(data) {
            'use strict';
            var ret = {};
            n$.tryExec(function () { ret = n$['?'].parseJSON(data); });
            if (n$.is.nullOrEmpty(ret)) {
                ret = {};
            }
            return ret;
        });

    n$.register('params',
        /**
         * Convert an Object into a serialized parameter string
        */
        function params(data, delimiter) {
            'use strict';
            var ret = '';
            delimiter = delimiter || '&';
            if (delimiter === '&') {
                n$.tryExec(function () { ret = n$['?'].param(data); });
            } else {
                n$.each(data, function (val, key) {
                    if (ret.length > 0) {
                        ret += delimiter;
                    }
                    ret += key + '=' + val;
                });
            }
            return n$.string(ret);
        });

    n$.register('extend',
        /**
         * Extend the properties of one object with the properties of another. Deep copy to recurse and preserve references.
        */
        function extend(destObj, srcObj, deepCopy) {
            'use strict';
            var ret = destObj || {};
            if (arguments.length === 3) {
                ret = window.$.extend(n$.bool(deepCopy), ret, srcObj);
            } else {
                ret = window.$.extend(ret, srcObj);
            }
            return ret;
        });

    n$.register('getArguments',
        /**
         * Take an arguments object and convert it into an Array
        */
        function (args, sliceAt) {
            'use strict';
            var slice = Array.prototype.slice;
            sliceAt = sliceAt || 0;

            var ret = slice.call(args, sliceAt);
            return ret;
        });

}(window.$nameSpace$));
