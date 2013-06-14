/*global n$:true,$Array:true,window:true,Number:true*/
(function(n$) {

    n$.is.register('bool', function(boolean) {
        'use strict';
        return (boolean	=== true || boolean	=== false);
    });

    n$.is.register('arrayNullOrEmpty', function(arr) {
        'use strict';
        return (!Array.isArray(arr) || !arr || !arr.length || arr.length === 0 || !arr.push);
    });

    n$.is.register('stringNullOrEmpty', function(str) {
        'use strict';
        return (str && ( !str.length || str.length === 0 || !str.trim || !str.trim() ));
    });

    n$.is.register('numberNullOrEmpty', function(num) {
        'use strict';
        return (!num || isNaN(num) || !num.toPrecision);
    });

    n$.is.register('dateNullOrEmpty', function(dt) {
        'use strict';
        return (!dt || !dt.getTime);
    });

    n$.is.register('objectNullOrEmpty', function(obj) {
        'use strict';
        return (!obj || !Object.keys(obj) || Object.keys(obj).length === 0);
    });

    n$.is.register('plainObject', function (obj) {
        'use strict';
        var ret = (n$['?'].isPlainObject(obj));
        return ret;
    });

    n$.is.register('date', function(dt) {
        return (dt instanceof Date);
    });

    /**
        Determines if a value is an instance of a Number and not NaN*
    */
    n$.is.register('number', function(num) {

        return (typeof num === 'number' &&
        false === (n$.number.isNaN(num) ||
            false === n$.number.isFinite(num) ||
            n$.number.MAX_VALUE === num ||
            n$.number.MIN_VALUE === num));
    });

    /**
        Determines if a value is convertable to a Number
    */
    n$.is.register('numeric', function(num) {
        var ret = n$.is.number(num);
        if (!ret) {
            var nuNum = n$.to.number(num);
            ret = n$.is.number(nuNum);
        }
        return ret;
    });

    n$.is.register('vendorObject', function (obj) {
        'use strict';
        var ret = (obj instanceof n$['?']);
        return ret;
    });

    n$.is.register('elementInDom', function (elementId) {
            return false === n$.is.nullOrEmpty(document.getElementById(elementId));
        });

    n$.is.register('generic', function (obj) {
        'use strict';
        var ret = (false === n$.is['function'](obj) && false === n$.hasLength(obj) && false === n$.is.plainObject(obj));
        return ret;
    });

    n$.is.register('array', function(obj) {
        return Array.isArray(obj);
    });


    n$.is.register('string', function(str) {
        return  null !== str &&
                (typeof str === 'string' || // covers any primitive assignment (e.g. var x = 'x')
                (typeof str === 'object' && str && str.valueOf && typeof str.valueOf() === 'string')); //covers any object assignment (e.g. var x = new String('x'))
    });

    n$.is.register('true', function (obj) {
        'use strict';
        return (
            obj === true ||
            obj === 'true' ||
            obj === 1 ||
            obj === '1'
        );
    });

    n$.is.register('false', function (obj) {
        'use strict';
        return (
            obj === false ||
            obj === 'false' ||
            obj === 0 ||
            obj === '0'
        );
    });

    n$.is.register('trueOrFalse', function (obj) {
        'use strict';
        return ( n$.is['true'](obj) || n$.is['false'](obj) );
    });

    n$.is.register('nullOrEmpty', function (obj, checkLength) {
        'use strict';
        var ret = false;
        if ((!obj && !n$.is.trueOrFalse(obj) && !n$.is.func(obj)) ||
            (checkLength && obj && (obj.length === 0 || (Object.keys(obj) && Object.keys(obj).length === 0)))) {
            ret = true;
        }
        return ret;
    });

    n$.is.register('instanceof', function (name, obj) {
        'use strict';
        return (obj.type === name || obj instanceof name);
    });

    n$.is.register('func', function(obj) {
        'use strict';
        return typeof(obj) === 'function';
    });


}(window.$nameSpace$));
