/*global OJ:true,$:true*/
(function() {

	OJ.makeSubNameSpace('is');

	OJ.is.lift('arrayNullOrEmpty', function(arr) {
		'use strict';
		return (!Array.isArray(arr) || !arr || !arr.length || arr.length === 0 || !arr.push);
	});

	OJ.is.lift('stringNullOrEmpty', function(str) {
		'use strict';
		return (str && ( !str.length || str.length === 0 || !str.trim || !str.trim() ));
	});

	OJ.is.lift('numberNullOrEmpty', function(num) {
		'use strict';
		return (!num || isNaN(num) || !num.toPrecision);
	});

	OJ.is.lift('dateNullOrEmpty', function(dt) {
		'use strict';
		return (!dt || !dt.getTime);
	});

	OJ.is.lift('objectNullOrEmpty', function(obj) {
		'use strict';
		return (!obj || !Object.keys(obj) || Object.keys(obj).length === 0);
	});

    OJ.is.lift('plainObject', function (obj) {
        'use strict';
        var ret = (window.$.isPlainObject(obj));
        return ret;
    });

	OJ.is.lift('date', function(dt) {
		return (dt instanceof Date);
	});

	OJ.is.lift('number', function(num) {
		return (typeof num === 'number');
	});

	OJ.is.lift('numeric', function(num) {
		var ret = false;
		if (OJ.is.number(num) && false === OJ.is.nullOrEmpty(num)) {
			var nuNum = +num;
			if (false === isNaN(nuNum)) {
				ret = true;
			}
		}
		return ret;
	});

    OJ.is.lift('jQuery', function (obj) {
        'use strict';
        var ret = (obj instanceof window.jQuery);
        return ret;
    });

    OJ.is.lift('elementInDom', function (elementId) {
            return false === OJ.is.nullOrEmpty(document.getElementById(elementId));
        });

    OJ.is.lift('generic', function (obj) {
        'use strict';
        var ret = (false === OJ.is['function'](obj) && false === OJ.hasLength(obj) && false === OJ.is.plainObject(obj));
        return ret;
    });

	OJ.is.lift('array', function(obj) {
		return $.isArray(obj);
	});


	OJ.is.lift('string', function(str) {
		return typeof str === 'string' || OJ.is.instanceOf('string', str);
	});

    OJ.is.lift('trueOrFalse', function (obj) {
        'use strict';
        return (
            obj === true ||
            obj === false ||
            obj === 'true' ||
            obj === 'false' ||
            obj === 1 ||
            obj === 0 ||
            obj === '1' ||
            obj === '0'
        );
    });

    OJ.is.lift('nullOrEmpty', function (obj, checkLength) {
        'use strict';
        var ret = false;
		if ((!obj && !OJ.is.trueOrFalse(obj) && !OJ.is.func(obj)) ||
			(checkLength && obj && (obj.length === 0 || (Object.keys(obj) && Object.keys(obj).length === 0)))) {
            ret = true;
        }
        return ret;
    });

    OJ.is.lift('instanceOf', function (name, obj) {
        'use strict';
        return (obj.type === name || obj instanceof name);
    });

    OJ.is.lift('func', function(obj) {
        'use strict';
        var ret = ($.isFunction(obj));
        return ret;
    });


}());