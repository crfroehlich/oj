(function() {

	OJ.lift('number', function(inputNum, defaultNum) {
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
	
}());