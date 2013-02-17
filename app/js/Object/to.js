/*global OJ:true,window:true,Number:true*/
(function (_$) {

    OJ.to.lift('bool', function bool(str) {
        var retBool = OJ.is['true'](str);
        if (retBool === false || retBool !== true) {
            retBool = false;
        }
        return retBool;
    });

    OJ.to.lift('ES5_ToBool', function (val) {
        return (val !== false && val !== 0 && val !== '' && val !== null && val !== undefined && (typeof val !== 'number' || !isNaN(val)));
    });

    OJ.to.lift('dateFromTicks', function (tickStr) {
        var ticsDateTime = OJ.string(tickStr);
        var ret, ticks, offset, localOffset, arr;

        if (false === OJ.is.nullOrEmpty(ticsDateTime)) {
            ticsDateTime = ticsDateTime.replace('/', '');
            ticsDateTime = ticsDateTime.replace('Date', '');
            ticsDateTime = ticsDateTime.replace('(', '');
            ticsDateTime = ticsDateTime.replace(')', '');
            arr = ticsDateTime.split('-');
            if (arr.length > 1) {
                ticks = OJ.number(arr[0]);
                offset = OJ.number(arr[1]);
                localOffset = new Date().getTimezoneOffset();
                ret = new Date((ticks - ((localOffset + (offset / 100 * 60)) * 1000)));
            }
            else if (arr.length === 1) {
                ticks = OJ.number(arr[0]);
                ret = new Date(ticks);
            }
        }
        return ret;
    });

    OJ.to.lift('binary', function (obj) {
        var ret = NaN;
        if (obj === 0 || obj === '0' || obj === '' || obj === false || OJ.to.string(obj).toLowerCase().trim() === 'false') {
            ret = 0;
        }
        else if (obj === 1 || obj === '1' || obj === true || OJ.to.string(obj).toLowerCase().trim() === 'true') {
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
    OJ.to.lift('number', function (inputNum, defaultNum) {
        'use strict';

        function tryGetNumber(val) {
            var ret = NaN;
            if (OJ.is.number(val)) {
                ret = val;
            }
            else if (OJ.is.string(val) || OJ.is.bool(val)) {

                var tryGet = (function (value) {
                    var num = OJ.to.binary(value);
                    if (!OJ.is.number(num) && value) {
                        num = +value;
                    }
                    if (!OJ.is.number(num)) {
                        num = parseInt(value, 0);
                    }
                    return num;
                }(val));

                if (OJ.is.number(tryGet)) {
                    ret = tryGet;
                }
            }
            return ret;
        }

        var retVal = tryGetNumber(inputNum);
        if (!OJ.is.number(retVal)) {
            retVal = tryGetNumber(defaultNum);
            if (!OJ.is.number(retVal)) {
                retVal = Number.NaN;
            }
        }
        return retVal;
    });

    OJ.to.lift('string', function (inputStr, defaultStr) {
        function tryGetString(str) {
            var ret;
            if (OJ.is.string(str)) {
                ret = str;
            }
            else {
                ret = '';
                if (OJ.is.bool(str) || OJ.is.number(str) || OJ.is.date(str)) {
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

    OJ.to.lift('vendorDomObject', function (id) {
        var ret = null;
        var _$el = _$('#' + id);
        if (_$el) {
            ret = _$el;
        }
        return ret;
    });

    OJ.to.lift('vendorDomObjFromString', function (html) {
        var ret = null;
        var _$el = _$(html);
        if (_$el) {
            ret = _$el;
        }
        return ret;
    });

}(OJ['?']));