(function() {

	OJ.makeSubNameSpace('to');

	OJ.to.lift('bool', function bool(str, nullIsTrue) {
		var retBool = false;
		function toBool() {
			var ret = (str === true),
				truthy;
			if(!ret) {
				if (str === false) {
					ret = false;
				} else {
					if(OJ.is.trueOrFalse(str)) {
						truthy = OJ.string(str).toLowerCase().trim();
						if (truthy === 'true' || truthy === '1') {
							ret = true;
						} else 
							ret = false;
						}
					} else if (nullIsTrue && OJ.is.nullOrEmpty(str)) {
						ret = true;
					} else {
						ret = false;
					}
				}
				return ret;
			}
		}
		retBool = toBool();

		return retBool;
	});

	OJ.to.lift('ES5_ToBool', function(val) {
	    return (val !== false &&
            val !== 0 &&
            val !== '' &&
            val !== null &&
            val !== undefined &&
            (typeof val !== 'number' || !isNaN(val)));
	});
    
	OJ.to.lift('dateFromTicks', function(tickStr) {
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
            } else if (arr.length === 1) {
                ticks = OJ.number(arr[0]);
                ret = new Date(ticks);
            }
        }
        return ret;
    });

	OJ.to.lift('number', function(inputNum, defaultNum) {
        'use strict';
        function tryGetNumber(val) {
            var ret = NaN;

            var getNumber = function(value) {
                var num = NaN;
                if (value) {
                    num = +value;
                }
                if (isNaN(num)) {
                    num = parseInt(value, 0);
                }
                return num;
            };

            var tryGet = getNumber(val);

            if (!window.Number.isNaN(tryGet) && 
                window.Number.isFinite(tryGet) &&
                window.Number.MAX_VALUE !== tryGet &&
                window.Number.MIN_VALUE !== tryGet) {
                ret = tryGet;
            } 
            return ret;
        }

        var retVal = tryGetNumber(inputNum) || tryGetNumber(defaultNum);

        return retVal;
    });

	OJ.to.lift('string', function (inputStr, defaultStr) {
            function tryGetString(str) {
                var ret = '';
                if (false === OJ.is.stringNullOrEmpty(str)) {
                    ret = str.toString();
                } 
                return ret;
            }

            var retObj = tryGetString(inputStr) || tryGetString(defaultStr);

            return retObj;

        });

}());