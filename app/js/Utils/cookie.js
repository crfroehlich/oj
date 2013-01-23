(function() {
 
	var ojInternal = {
		cookies: {},
	};

	var ojReturn = {
	
	};
	
	OJ.makeSubNameSpace('cookies');

	OJ.cookies.lift('get', function (cookiename) {
		var ret = OJ.string($.cookie(cookiename));
		if(ret !== ojInternal.cookies[cookiename]) {
			ojInternal.cookies[cookiename] = ret;
		}
		return ret;
	});

    OJ.cookies.lift('set', function (cookiename, value) {
		ojInternal.cookies[cookiename] = value;
		return $.cookie(cookiename, value);
	};

    OJ.cookies.lift('remove', function (cookiename) {
		delete ojInternal.cookies[cookiename];
		return $.cookie(cookiename, '');
	});

   OJ.cookies.lift('clear', function () {
		var cookieName;
		for (cookieName in ojInternal.cookies) {
			OJ.cookies.remove(cookieName);
		}
		return true;
	});
	
}());