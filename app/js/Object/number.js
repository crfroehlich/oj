(function() {

	OJ.number = OJ.number || 
		OJ.lift('number', function(inputNum, defaultNum) {
        function tryGetNumber() {
            var ret = NaN;

            function getNumber(value) {
                var num = NaN;
                if (value) {
                    num = +value;
                }
                if (isNaN(num)) {
                    num = parseInt(value, 0);
                }
                return num;
            }
            var tryGet = getNumber(inputNum);

            if (false === isNaN(tryGet) && tryGet !== int32MinVal) {
                ret = tryGet;
            } else {
                tryGet = getNumber(defaultNum);
                if (false === isNaN(tryGet) && tryGet !== int32MinVal) {
                    ret = tryGet;
                }
            }
            return ret;
        }

        var retVal = tryGetNumber();

        return retVal;
    });
	
}());