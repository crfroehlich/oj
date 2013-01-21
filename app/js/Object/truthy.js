(function() {

	OJ.is.arrayNullOrEmpty = OJ.is.arrayNullOrEmpty || 
		OJ.is.lift('arrayNullOrEmpty', function(arr) {
			'use strict';			
			return (!arr || !arr.length || arr.length === 0 || !arr.push);
		});
	
	OJ.is.stringNullOrEmpty = OJ.is.stringNullOrEmpty || 
		OJ.is.lift('stringNullOrEmpty', function(str) {
			'use strict';			
			return (!str || !str.length || str.length === 0 || !str.toLowerCase);
		});
		
	OJ.is.numberNullOrEmpty = OJ.is.numberNullOrEmpty || 
		OJ.is.lift('numberNullOrEmpty', function(num) {
			'use strict';
			return (!num || isNaN(num) || !num.toPrecision);
		};	
			
	OJ.is.dateNullOrEmpty = OJ.is.dateNullOrEmpty || 
		OJ.is.lift('dateNullOrEmpty', function(dt) {
			'use strict';			
			return (!dt || !dt.getTime);
		});		
		
	OJ.is.objectNullOrEmpty = OJ.is.objectNullOrEmpty || 
		OJ.is.lift('objectNullOrEmpty', function(obj) {
			'use strict';
			return (!obj || !obj.keys || obj.keys.length == 0);
		};	

	OJ.is.plainObject = OJ.is.plainObject ||
        OJ.is.lift('isPlainObject', function (obj) {
            'use strict';
            var ret = (window.$.isPlainObject(obj));
            return ret;
        });

	OJ.is.date = OJ.is.date || 
		OJ.lift('date', function(dt) {
			return (dt instanceof Date);
		});
		
	OJ.is.number = OJ.is.number || 
		OJ.is.lift('number', function(num) {
			return (typeof num === 'number');
		});
		
	OJ.is.numeric = OJ.is.numeric || 
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
		
    OJ.is.jQuery = OJ.is.jQuery ||
        OJ.is.lift('isJQuery', function (obj) {
            'use strict';
            var ret = (obj instanceof window.jQuery);
            return ret;
        });

    OJ.is.generic = OJ.is.generic ||
        OJ.is.lift('isGeneric', function (obj) {
            'use strict';
            var ret = (false === OJ.is.function(obj) && false === OJ.hasLength(obj) && false === OJ.is.plainObject(obj));
            return ret;
        });
    
	OJ.is.array = OJ.is.array || 
		OJ.is.lift('array', function(obj) {
			return $.isArray(obj);
		});
	
	OJ.is.string = OJ.is.string || 
		OJ.is.lift('string', function(str) {
			return typeof obj === 'string' || OJ.is.instanceOf('string', obj);
		});
	
    OJ.is.trueOrFalse = OJ.is.trueOrFalse ||
        OJ.is.lift('trueOrFalse', function (obj) {
            'use strict';
            return (
                obj === true ||
                    obj === false ||
                    obj === 1 ||
                    obj === 0 ||
                    obj === 'true' ||
                    obj === 'false'
            );
        });

    OJ.is.nullOrEmpty = OJ.is.nullOrEmpty ||
        OJ.is.lift('nullOrEmpty', function (obj, checkLength) {
            'use strict';
            var ret = (false === OJ.is.func(obj));
			if (ret && (!obj && !OJ.is.trueOrFalse(obj) && (obj.length === 0 || obj.keys.length === 0))) {
                ret = true;
            }
            return ret;
        });

    OJ.is.instanceOf = OJ.is.instanceOf ||
        OJ.is.lift('instanceOf', function (name, obj) {
            'use strict';
            return (obj.type === name || obj instanceof name);
        });
		
		
}();