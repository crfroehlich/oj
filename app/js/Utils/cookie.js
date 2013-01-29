/*global OJ:true,$:true*/
(function() {

	var ojInternal = {
		cookies: {}
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
	});

    OJ.cookies.lift('remove', function (cookiename) {
		delete ojInternal.cookies[cookiename];
		return $.cookie(cookiename, '');
	});

   OJ.cookies.lift('clear', function () {
		Object.keys(ojInternal.cookies).forEach(function(key) {
		OJ.cookies.remove(key);
		});
		return true;
	});

}());