(function() {
 
	var ojInternal = {
		cookies: {},
	};

	var ojReturn = {
	
	};
	
	ojReturn.get = function (cookiename) {
		var ret = OJ.string($.cookie(cookiename));
		if(ret !== ojInternal.cookies[cookiename]) {
			ojInternal.cookies[cookiename] = ret;
		}
		return ret;
	};

    ojReturn.set = function (cookiename, value) {
		ojInternal.cookies[cookiename] = value;
		return $.cookie(cookiename, value);
	};

    ojReturn.clear = function (cookiename) {
		delete ojInternal.cookies[cookiename];
		return $.cookie(cookiename, '');
	};

   ojReturn.clearAll = function () {
		var cookieName;
		for (cookieName in ojInternal.cookies) {
			$.cookie(cookieName, null);
		}
		return true;
	};

	OJ.cookie = OJ.cookie ||
		OJ.lift('cookie', ojReturn);
	
}());