(function() {

	OJ.hasLength = OJ.hasLength ||
        OJ.lift('hasLength', function (obj) {
            'use strict';
            var ret = (OJ.is.array(obj) || OJ.is.jQuery(obj));
            return ret;
        });

    OJ.contains = OJ.contains ||
        OJ.lift('contains', function (object, index) {
            'use strict';
            var ret = false;
            if (false === OJ.is.nullOrUndefined(object)) {
                if (OJ.is.array(object)) {
                    ret = object.indexOf(index) !== -1;
                }
                if (false === ret && object.hasOwnProperty(index)) {
                    ret = true;
                }
            }
            return ret;
        });

    OJ.renameProperty = OJ.renameProperty ||
        OJ.lift('renameProperty', function (obj, oldName, newName) {
            'use strict';
            if (false === OJ.is.nullOrUndefined(obj) && OJ.contains(obj, oldName)) {
                obj[newName] = obj[oldName];
                delete obj[oldName];
            }
            return obj;
        });

    OJ.clone = OJ.clone ||
        OJ.lift('clone', function (data) {
            'use strict';
            return OJ.deserialize(OJ.serialize(data));
        });

    OJ.serialize = OJ.serialize ||
        OJ.lift('serialize', function (data) {
            'use strict';
            var ret = '';
            OJ.tryExec(function() { ret = JSON.stringify(data); });
            return ret;
        });

    OJ.deserialize = OJ.deserialize ||
        OJ.lift('deserialize', function (data) {
            'use strict';
            var ret = {};
            OJ.tryExec(function () { ret = window.$.parseJSON(data); });
            if(OJ.isNullOrEmpty(ret)) {
				ret = {};
			}
			return ret;
        });
    
    OJ.params = OJ.params ||
        OJ.lift('params', function (data, delimiter) {
            var ret = '';
            delimiter = delimiter || '&';
            if (delimiter === '&') {
                OJ.tryExec(function() { ret = $.param(data); });
            } else {
                OJ.each(data, function(val, key) {
                    if(ret.length > 0) {
                        ret += delimiter;
                    }
                    ret += key + '=' + val;
                });
            }
            return OJ.string(ret);
        });

    OJ.extend = OJ.extend ||
        OJ.lift('extend', function (destObj, srcObj, deepCopy) {
            'use strict';
            var ret = destObj || {};
            if(arguments.length === 3) {
                ret = window.$.extend(OJ.bool(deepCopy), ret, srcObj);
            } else {
                ret = window.$.extend(ret, srcObj);
            }
            return ret;
        });
		
}());