(function() {

    OJ.lift('hasLength', function (obj) {
        'use strict';
        var ret = (OJ.is.array(obj) || OJ.is.jQuery(obj));
        return ret;
    });

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

    OJ.lift('renameProperty', function (obj, oldName, newName) {
        'use strict';
        if (false === OJ.is.nullOrUndefined(obj) && OJ.contains(obj, oldName)) {
            obj[newName] = obj[oldName];
            delete obj[oldName];
        }
        return obj;
    });

    OJ.lift('clone', function (data) {
        'use strict';
        return OJ.deserialize(OJ.serialize(data));
    });

    OJ.lift('serialize', function (data) {
        'use strict';
        var ret = '';
        OJ.tryExec(function() { ret = JSON.stringify(data); });
        return ret;
    });


    OJ.lift('deserialize', function (data) {
        'use strict';
        var ret = {};
        OJ.tryExec(function () { ret = window.$.parseJSON(data); });
        if(OJ.is.nullOrEmpty(ret)) {
			ret = {};
		}
		return ret;
    });
    
    OJ.lift('params', function (data, delimiter) {
         'use strict';
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

    OJ.lift('each', function(object, callBack) {
         'use strict';
         if(OJ.is.array(object) && object.length > 0) {
            object.forEach(callBack);
         } 
         else if(object && object.keys && object.keys.length > 0) {
            object.keys.forEach(callBack);
         }
         return null;
    });
		
}());