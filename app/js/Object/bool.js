(function() {

	OJ.lift('bool', function bool(str, trueIfNull) {
		var retBool = false;
		function toBool() {
			var ret = (str === true),
				truthy;
			if(!ret) {
				if (str === false) {
					ret = false;
				} else {
					truthy = OJ.string(str).toLowerCase().trim();
					if (truthy === 'true' || truthy === '1') {
						ret = true;
					} else if (trueIfNull && OJ.is.nullOrEmpty(str)) {
						ret = true;
					} else if (truthy === 'false' || truthy === '0') {
						ret = false;
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
    
}());