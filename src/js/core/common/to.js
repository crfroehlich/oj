/*global n$:true,window:true,Number:true*/
(function (n$) {

    n$.to.register('bool', function bool(str) {
        var retBool = n$.is['true'](str);
        if (retBool === false || retBool !== true) {
            retBool = false;
        }
        return retBool;
    });

    n$.to.register('ES5_ToBool', function (val) {
        return (val !== false && val !== 0 && val !== '' && val !== null && val !== undefined && (typeof val !== 'number' || !isNaN(val)));
    });

    n$.to.register('dateFromTicks', function (tickStr) {
        var ticsDateTime = n$.string(tickStr);
        var ret, ticks, offset, localOffset, arr;

        if (false === n$.is.nullOrEmpty(ticsDateTime)) {
            ticsDateTime = ticsDateTime.replace('/', '');
            ticsDateTime = ticsDateTime.replace('Date', '');
            ticsDateTime = ticsDateTime.replace('(', '');
            ticsDateTime = ticsDateTime.replace(')', '');
            arr = ticsDateTime.split('-');
            if (arr.length > 1) {
                ticks = n$.number(arr[0]);
                offset = n$.number(arr[1]);
                localOffset = new Date().getTimezoneOffset();
                ret = new Date((ticks - ((localOffset + (offset / 100 * 60)) * 1000)));
            }
            else if (arr.length === 1) {
                ticks = n$.number(arr[0]);
                ret = new Date(ticks);
            }
        }
        return ret;
    });

    n$.to.register('binary', function (obj) {
        var ret = NaN;
        if (obj === 0 || obj === '0' || obj === '' || obj === false || n$.to.string(obj).toLowerCase().trim() === 'false') {
            ret = 0;
        }
        else if (obj === 1 || obj === '1' || obj === true || n$.to.string(obj).toLowerCase().trim() === 'true') {
            ret = 1;
        }
        return ret;
    });

    /**
     *   Attempts to converts an arbitrary value to a Number.
     *   Loose falsy values are converted to 0.
     *   Loose truthy values are converted to 1.
     *   All other values are parsed as Integers.
     *   Failures return as NaN.
     *
     */
    n$.to.register('number', function (inputNum, defaultNum) {
        'use strict';

        function tryGetNumber(val) {
            var ret = NaN;
            if (n$.is.number(val)) {
                ret = val;
            }
            else if (n$.is.string(val) || n$.is.bool(val)) {

                var tryGet = (function (value) {
                    var num = n$.to.binary(value);
                    if (!n$.is.number(num) && value) {
                        num = +value;
                    }
                    if (!n$.is.number(num)) {
                        num = parseInt(value, 0);
                    }
                    return num;
                }(val));

                if (n$.is.number(tryGet)) {
                    ret = tryGet;
                }
            }
            return ret;
        }

        var retVal = tryGetNumber(inputNum);
        if (!n$.is.number(retVal)) {
            retVal = tryGetNumber(defaultNum);
            if (!n$.is.number(retVal)) {
                retVal = Number.NaN;
            }
        }
        return retVal;
    });

    n$.to.register('string', function (inputStr, defaultStr) {
        function tryGetString(str) {
            var ret;
            if (n$.is.string(str)) {
                ret = str;
            }
            else {
                ret = '';
                if (n$.is.bool(str) || n$.is.number(str) || n$.is.date(str)) {
                    ret = str.toString();
                }
            }
            return ret;
        }

        var ret1 = tryGetString(inputStr);
        var ret2 = tryGetString(defaultStr);
        var retVal = '';
        if (ret1.length !== 0) {
            retVal = ret1;
        }
        else if (ret1 === ret2 || ret2.length === 0) {
            retVal = ret1;
        }
        else {
            retVal = ret2;
        }

        return retVal;
    });

    n$.to.register('vendorDomObject', function (id) {
        var ret = null;
        var base = '#';
        if(id === 'body') {
            base = '';
        }
        var _$el = n$['?'](base + id);
        if (_$el) {
            ret = _$el;
        }
        return ret;
    });

    n$.to.register('vendorDomObjFromString', function (html) {
        var ret = null;
        var _$el = n$['?'](html);
        if (_$el) {
            ret = _$el;
        }
        return ret;
    });

}(window.$nameSpace$));
