(function() {

	OJ.lift('bool', function bool(str, nullIsTrue) {
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

	OJ.lift('ES5_ToBool', function(val) {
	    return (val !== false &&
            val !== 0 &&
            val !== '' &&
            val !== null &&
            val !== undefined &&
            (typeof val !== 'number' || !isNaN(val)));
	});
    
}());