/*global n$:true,$Array:true,window:true,Number:true*/
(function(n$) {

    n$.is.lift('bool', function(boolean) {
        'use strict';
        return (boolean	=== true || boolean	=== false);
    });

    n$.is.lift('arrayNullOrEmpty', function(arr) {
        'use strict';
        return (!Array.isArray(arr) || !arr || !arr.length || arr.length === 0 || !arr.push);
    });

    n$.is.lift('stringNullOrEmpty', function(str) {
        'use strict';
        return (str && ( !str.length || str.length === 0 || !str.trim || !str.trim() ));
    });

    n$.is.lift('numberNullOrEmpty', function(num) {
        'use strict';
        return (!num || isNaN(num) || !num.toPrecision);
    });

    n$.is.lift('dateNullOrEmpty', function(dt) {
        'use strict';
        return (!dt || !dt.getTime);
    });

    n$.is.lift('objectNullOrEmpty', function(obj) {
        'use strict';
        return (!obj || !Object.keys(obj) || Object.keys(obj).length === 0);
    });

    n$.is.lift('plainObject', function (obj) {
        'use strict';
        var ret = (n$['?'].isPlainObject(obj));
        return ret;
    });

    n$.is.lift('date', function(dt) {
        return (dt instanceof Date);
    });

    /**
        Determines if a value is an instance of a Number and not NaN*
    */
    n$.is.lift('number', function(num) {

        return (typeof num === 'number' &&
        false === (n$.number.isNaN(num) ||
            false === n$.number.isFinite(num) ||
            n$.number.MAX_VALUE === num ||
            n$.number.MIN_VALUE === num));
    });

    /**
        Determines if a value is convertable to a Number
    */
    n$.is.lift('numeric', function(num) {
        var ret = n$.is.number(num);
        if (!ret) {
            var nuNum = n$.to.number(num);
            ret = n$.is.number(nuNum);
        }
        return ret;
    });

    n$.is.lift('vendorObject', function (obj) {
        'use strict';
        var ret = (obj instanceof n$['?']);
        return ret;
    });

    n$.is.lift('elementInDom', function (elementId) {
            return false === n$.is.nullOrEmpty(document.getElementById(elementId));
        });

    n$.is.lift('generic', function (obj) {
        'use strict';
        var ret = (false === n$.is['function'](obj) && false === n$.hasLength(obj) && false === n$.is.plainObject(obj));
        return ret;
    });

    n$.is.lift('array', function(obj) {
        return Array.isArray(obj);
    });


    n$.is.lift('string', function(str) {
        return  null !== str &&
                (typeof str === 'string' || // covers any primitive assignment (e.g. var x = 'x')
                (typeof str === 'object' && str && str.valueOf && typeof str.valueOf() === 'string')); //covers any object assignment (e.g. var x = new String('x'))
    });

    n$.is.lift('true', function (obj) {
        'use strict';
        return (
            obj === true ||
            obj === 'true' ||
            obj === 1 ||
            obj === '1'
        );
    });

    n$.is.lift('false', function (obj) {
        'use strict';
        return (
            obj === false ||
            obj === 'false' ||
            obj === 0 ||
            obj === '0'
        );
    });

    n$.is.lift('trueOrFalse', function (obj) {
        'use strict';
        return ( n$.is['true'](obj) || n$.is['false'](obj) );
    });

    n$.is.lift('nullOrEmpty', function (obj, checkLength) {
        'use strict';
        var ret = false;
        if ((!obj && !n$.is.trueOrFalse(obj) && !n$.is.func(obj)) ||
            (checkLength && obj && (obj.length === 0 || (Object.keys(obj) && Object.keys(obj).length === 0)))) {
            ret = true;
        }
        return ret;
    });

    n$.is.lift('instanceof', function (name, obj) {
        'use strict';
        return (obj.type === name || obj instanceof name);
    });

    n$.is.lift('func', function(obj) {
        'use strict';
        return typeof(obj) === 'function';
    });


}(window.$nameSpace$));
