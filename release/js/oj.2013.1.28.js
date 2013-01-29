/*global OJ:true,$:true*/
(function() {

	OJ.makeSubNameSpace('to');

	OJ.to.lift('bool', function bool(str, nullIsTrue) {
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
						} else {
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

	OJ.to.lift('ES5_ToBool', function(val) {
	    return (val !== false &&
            val !== 0 &&
            val !== '' &&
            val !== null &&
            val !== undefined &&
            (typeof val !== 'number' || !isNaN(val)));
	});
    
	OJ.to.lift('dateFromTicks', function(tickStr) {
		var ticsDateTime = OJ.string(tickStr);
        var ret, ticks, offset, localOffset, arr;
        
        if (false === OJ.is.nullOrEmpty(ticsDateTime)) {
            ticsDateTime = ticsDateTime.replace('/', '');
            ticsDateTime = ticsDateTime.replace('Date', '');
            ticsDateTime = ticsDateTime.replace('(', '');
            ticsDateTime = ticsDateTime.replace(')', '');
            arr = ticsDateTime.split('-');
            if (arr.length > 1) {
                ticks = OJ.number(arr[0]);
                offset = OJ.number(arr[1]);
                localOffset = new Date().getTimezoneOffset();
                ret = new Date((ticks - ((localOffset + (offset / 100 * 60)) * 1000)));
            } else if (arr.length === 1) {
                ticks = OJ.number(arr[0]);
                ret = new Date(ticks);
            }
        }
        return ret;
    });

	OJ.to.lift('number', function(inputNum, defaultNum) {
        'use strict';
        function tryGetNumber(val) {
            var ret = NaN;

            var getNumber = function(value) {
                var num = NaN;
                if (value) {
                    num = +value;
                }
                if (isNaN(num)) {
                    num = parseInt(value, 0);
                }
                return num;
            };

            var tryGet = getNumber(val);

            if (!window.Number.isNaN(tryGet) && 
                window.Number.isFinite(tryGet) &&
                window.Number.MAX_VALUE !== tryGet &&
                window.Number.MIN_VALUE !== tryGet) {
                ret = tryGet;
            } 
            return ret;
        }

        var retVal = tryGetNumber(inputNum) || tryGetNumber(defaultNum);

        return retVal;
    });

	OJ.to.lift('string', function (inputStr, defaultStr) {
            function tryGetString(str) {
                var ret = '';
                if (false === OJ.is.stringNullOrEmpty(str)) {
                    ret = str.toString();
                } 
                return ret;
            }

            var retObj = tryGetString(inputStr) || tryGetString(defaultStr);

            return retObj;

        });

}());
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
        var ret = (false === OJ.is.function(obj) && false === OJ.hasLength(obj) && false === OJ.is.plainObject(obj));
        return ret;
    });

	OJ.is.lift('array', function(obj) {
		return $.isArray(obj);
	});


	OJ.is.lift('string', function(str) {
		return typeof obj === 'string' || OJ.is.instanceOf('string', obj);
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
/*global OJ:true*/
(function() {

    OJ.delimitedString = OJ.delimitedString ||
        OJ.lift('delimitedString', function (string, opts) {
            var ojInternal = {
                newLineToDelimiter: true,
                spaceToDelimiter: true,
                removeDuplicates: true,
                delimiter: ',',
                initString: OJ.to.string(string)
            };

            var ojReturn = {
                array: [],
                delimited: function () {
                    return ojReturn.array.join(ojInternal.delimiter);
                },
                string: function (delimiter) {
                    delimiter = delimiter || ojInternal.delimiter;
                    var ret = '';
                    OJ.each(ojReturn.array, function (val) {
                        if (ret.length > 0) {
                            ret += delimiter;
                        }
                        ret += val;
                    });
                    return ret;
                },
                toString: function () {
                    return ojReturn.string();
                },
                add: function (str) {
                    ojReturn.array.push(ojInternal.parse(str));
                    ojInternal.deleteDuplicates();
                    return ojReturn;
                },
                remove: function (str) {
                    var remove = function (array) {
                        return array.filter(function (item) {
                            if (item !== str) {
                                return true;
                            }
                        });
                    };
                    ojReturn.array = remove(ojReturn.array);
                    return ojReturn;
                },
                count: function() {
                    return ojReturn.array.length;
                },
                contains: function (str, caseSensitive) {
                    var isCaseSensitive = OJ.to.bool(caseSensitive);
                    str = OJ.string(str).trim();
                    if (false === isCaseSensitive) {
                        str = str.toLowerCase();
                    }
                    var match = ojReturn.array.filter(function (matStr) {
                        return ((isCaseSensitive && OJ.to.string(matStr).trim() === str) || OJ.to.string(matStr).trim().toLowerCase() === str);
                    });
                    return match.length > 0;
                },
                each: function(callBack) {
                    return ojReturn.array.forEach(callBack);
                }
            };

            ojInternal.parse = function (str) {
                var ret = OJ.to.string(str);

                if (ojInternal.newLineToDelimiter) {
                    while (ret.indexOf('\n') !== -1) {
                        ret = ret.replace(/\n/g, ojInternal.delimiter);
                    }
                }
                if (ojInternal.spaceToDelimiter) {
                    while (ret.indexOf(' ') !== -1) {
                        ret = ret.replace(/ /g, ojInternal.delimiter);
                    }
                }
                while (ret.indexOf(',,') !== -1) {
                    ret = ret.replace(/,,/g, ojInternal.delimiter);
                }
                return ret;
            };

            ojInternal.deleteDuplicates = function () {
                if (ojInternal.removeDuplicates) {
                    (function () {

                        var unique = function (array) {
                            var seen = new Set;
                            return array.filter(function (item) {
                                if (false === seen.has(item)) {
                                    seen.add(item);
                                    return true;
                                }
                            });
                        };

                        ojReturn.array = unique(ojReturn.array);
                    }());
                }
            };

            (function (a) { 
                if (a.length > 1 && false === OJ.is.plainObject(opts)) {
                    OJ.each(a, function (val) {
                        if (false === OJ.is.nullOrEmpty(val)) {
                            ojReturn.array.push(val);
                        }
                    });
                } else if(string && string.length > 0) {
                    OJ.extend(ojInternal, opts);
                    var delimitedString = ojInternal.parse(string);
                    ojInternal.initString = delimitedString;
                    ojReturn.array = delimitedString.split(ojInternal.delimiter);
                }

                ojInternal.deleteDuplicates();
            }(arguments));
            return ojReturn;
        });
}());
/*global OJ:true*/
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
         else if(object && Object.keys(object) && Object.keys(object).length > 0) {
            Object.keys(object).forEach(callBack);
         }
         return null;
    });

}());
/*global OJ:true*/
(function(){
	
	OJ.lift('tryExec', function(func) {
        'use strict';
        var ret = false;
        try {
            if (OJ.is.func(func)) {
                ret = func.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        } catch(exception) {
            if ((exception.name !== 'TypeError' ||
                exception.type !== 'called_non_callable') &&
                exception.type !== 'non_object_property_load') { /* ignore errors failing to exec self-executing functions */
                OJ.console.error(exception);
            }
        } finally {
            return ret;
        }
    });

    OJ.lift('tryThisThenThat', function(first, second) {
        'use strict';
        var ret = false;
        try {
            if (OJ.is.func(first)) {
                ret = first.apply(this, Array.prototype.slice.call(arguments, 2));
            }
        } catch(exception) {
            if ((exception.name !== 'TypeError' ||
                exception.type !== 'called_non_callable') &&
                exception.type !== 'non_object_property_load') { /* ignore errors failing to exec self-executing functions */
                OJ.console.error(exception);
                try {
                    if (OJ.is.func(second)) {
                        ret = second.apply(this, Array.prototype.slice.call(arguments, 2));
                    }
                } catch(e) {
                    
                }
            }
        } finally {
            return ret;
        }
    });

    
    OJ.lift('method', function(func) {
        'use strict';
        var that = this;
        return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(func);
            return OJ.tryExec.apply(that, args);
        };
    });

}());
(function() {

    /**
        The OJ  NameSpace, an IIFO
        @namespace
        @export
        @return {OJ}
    */
    window.OrangeJuice = window.OJ = (function() {
        'use strict';
        ///<summary>Intializes the OJ namespace. Immediately invoked function object.</summary>
        ///<returns type="OJ">The OJ namespace.</returns>

        var prototype = Object.create(null);

        var makeNameSpace = function(proto) {
            'use strict';

            proto = proto || Object.create(null);

            var ret = Object.create(proto);

            proto['lift'] = function(name, obj) {
                'use strict';
				if(name && obj) {
					Object.defineProperty(ret, name, {
                        value: obj,
                        writable: false,
                        enumerable: false,
                        configurable: false
                    });
				}
                return obj;
            };

            proto['makeSubNameSpace'] = function(subNameSpace) {
				return Object.defineProperty(ret, subNameSpace, {
                        value: makeNameSpace(null),
                        writable: false,
                        enumerable: false,
                        configurable: false
                    });
			};
            return ret;
        };

        var OjOut = makeNameSpace(prototype);

        return OjOut;

    }());

}());
/*global OJ:true,$:true*/
(function() {

	var ojInternal = {
		cookies: {},
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
		var cookieName;
		for (cookieName in ojInternal.cookies) {
			OJ.cookies.remove(cookieName);
		}
		return true;
	});

}());
/*global OJ:true*/
(function() {

	var init = function() {
		var initObj = {
			keys: [],
			deserialize: OJ.deserialize,
			serializer: OJ.serialize,
			hasLocalStorage: (window.Modernizr.localstorage),
			hasSessionStorage: (window.Modernizr.sessionstorage)
		};
		initObj.serialize = initObj.serializer.stringify;
	};
	var ojInternal;

    var hasWebStorage = function () {
            ojInternal.hasLocalStorage = (window.Modernizr.localstorage || window.Modernizr.sessionstorage);
			return ojInternal || (window.Modernizr.localstorage || window.Modernizr.sessionstorage);
    };

	OJ.makeSubNameSpace('localDb');


    OJ.localDb.lift('clear', function (clearAll) {
            ojInternal = ojInternal || init();
			if (OJ.bool(clearAll)) {
                //nuke the entire storage collection
                if (ojInternal.hasLocalStorage) {
                    window.localStorage.clear();
                }
                if (ojInternal.hasSessionStorage) {
                    window.sessionStorage.clear();
                }
                ojInternal.closureStorage.clear();
            } else {
                ojInternal.keys.forEach(function (key) {
                    OJ.localDb.removeItem(key);
                });
            }
            return OJ.localDb;
     });

    OJ.localDb.lift('getItem',  function (key) {
		ojInternal = ojInternal || init();
		var ret = '';
		if (false === OJ.is.nullOrEmpty(key)) {
			var value = OJ.string(window.localStorage.getItem(key));
			if (OJ.is.nullOrEmpty(value) || value === 'undefined') {
				value = OJ.string(window.sessionStorage.getItem(key));
			}
			if (!OJ.is.nullOrEmpty(value) && value !== 'undefined') {
				try {
					ret = ojInternal.deserialize(value);
				} catch (e) {
					ret = value;
				}
			}
		}
		return ret;
    });

    OJ.localDb.lift('getKeys',  function () {
		ojInternal = ojInternal || init();
		var locKey, sesKey, memKey;
		if (OJ.is.nullOrEmpty(ojInternal.keys) && window.localStorage.length > 0) {
			for (locKey in window.localStorage) {
				ojInternal.keys.push(locKey);
			}
			if (window.sessionStorage.length > 0) {
				for (sesKey in window.sessionStorage) {
					ojInternal.keys.push(sesKey);
				}
			}
		}
		return ojInternal.keys;
	});

    OJ.localDb.lift('hasKey',  function (key) {
		ojInternal = ojInternal || init();
		var ret = OJ.contains(OJ.localDb.getKeys(), key);
		return ret;
	});

    OJ.localDb.lift('removeItem', function (key) {
		window.localStorage.removeItem(key);
		window.sessionStorage.removeItem(key);
		delete ojInternal.keys[key];
	});

    OJ.localDb.lift('setItem', function (key, value) {
		var ret = true;
		if (false === OJ.isNullOrEmpty(key)) {
			if (false === OJ.localDb.hasKey(key)) {
				ojInternal.keys.push(key);
			}
			var val = (typeof value === 'object') ? ojInternal.serialize(value) : value;

			try {
				window.localStorage.setItem(key, val);
			} catch (locErr) {
				try {
					window.localStorage.removeItem(key);
					window.sessionStorage.setItem(key, val);
				} catch (ssnErr) {
					try {
						window.sessionStorage.removeItem(key);
					} catch (memErr) {
						ret = false;
					}
				}
			}
		}
		return ret;
    });

}());
/*global OJ:true*/
(function () {
    'use strict';
    var OjInternal = {
        bindingObj: $({})
    };
    
    OJ.lift('subscribe', function () {
        OjInternal.bindingObj.on.apply(OjInternal.bindingObj, arguments);
    });


    OJ.lift('unsubscribe', function () {
        OjInternal.bindingObj.off.apply(OjInternal.bindingObj, arguments);
    });


    OJ.lift('publish', function () {
        OjInternal.bindingObj.trigger.apply(OjInternal.bindingObj, arguments);
    });


	OJ.lift('listBindings', function() {
		for (var prop in OjInternal.bindingObj[0]) {
			if (OjInternal.bindingObj[0].hasOwnProperty(prop)) {
				if (OjInternal.bindingObj[0][prop].events) {
					return OjInternal.bindingObj[0][prop].events;
				}
			}
		}
    });
    
} ());
/*global OJ:true*/
(function () {
    'use strict';
    
    OJ.makeSubNameSpace('console');

    OJ.console.lift('assert', OJ.method(function (truth, msg) {
        console.assert(truth, msg);
    }));

    OJ.console.lift('count', OJ.method(function (msg) {
        console.count(msg);
    }));
    
    OJ.console.lift('error', OJ.method(function (msg) {
        console.error(msg);
    }));

    OJ.console.lift('group', OJ.method(function (name) {
        console.group(name);
    }));

    OJ.console.lift('groupCollapsed', OJ.method(function (name) {
        console.groupCollapsed(name);
    }));

    OJ.console.lift('groupEnd', OJ.method(function (name) {
        console.groupEnd(name);
    }));

    OJ.console.lift('info', OJ.method(function (msg) {
        console.info(msg);
    }));

    OJ.console.lift('log', OJ.method(function (msg) {
        console.log(msg);
    }));

    OJ.console.lift('profile', OJ.method(function (msg) {
        console.profile(msg);
    }));

    OJ.console.lift('profileEnd', OJ.method(function (msg) {
        console.profileEnd(msg);
    }));

    OJ.console.lift('time', OJ.method(function (msg) {
        console.time(msg);
    }));

    OJ.console.lift('timeEnd', OJ.method(function (msg) {
        console.timeEnd(msg);
    }));

    OJ.console.lift('trace', OJ.method(function (msg) {
        console.trace(msg);
    }));

    OJ.console.lift('warn', OJ.method(function (msg) {
        console.warn(msg);
    }));
	
}());

/*global OJ:true*/
(function() {

    OJ.elements.lift('span', function(OjNode, options) {

        var span = OjNode.addChild('<span id="' + options.id +  '" value="' + options.value + '">' + OJ.to.string(options.display) + '</span>');
        span.data(options);
        span.addClass(options.cssclass);
        span.css(options.styles);
        span.attr(options.attr);
        span.prop(options.prop);

        return span;

    });


}());
/*global OJ:true*/
(function() {

    OJ.elements.lift('div', function(OjNode, options) {

        var div = OjNode.addChild('<div id="' + options.id +  '" value="' + options.value + '">' + OJ.to.string(options.display) + '</div>');
        div.data(options);
        div.addClass(options.cssclass);
        div.css(options.styles);
        div.attr(options.attr);
        div.prop(options.prop);

        return div;

    });


}());
/*global OJ:true*/
(function(){

    OJ.makeSubNameSpace('elements');

    OJ.node.lift('factory',
        function(OjNode) {
            'use strict';

            if(!OjNode || true !== OjNode.isValid) {
                throw new Error('Cannot make an OJ factory without an OJ Node!');
            }

            var OjInternal = {
                count: 0
            };

            var isChildNodeTypeAllowed = (function() {
                //This list is not yet exhaustive, just exclude the obvious
                var nonNestableNodes = ['li', 'legend', 'tr', 'td', 'option', 'body', 'head', 'source', 'tbody'];
                return function(tagName) {
                    var ret = false;
                    switch(OjNode.tagName.toLowerCase()) {
                        case 'body':
                            ret= (tagName === 'div' || tagName === 'span' || tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6' || tagName === 'p' || tagName === 'fieldset' || tagName === 'select' || tagName === 'ol' || tagName === 'ul' || tagName === 'table');
                            break;
                        case 'div':
                            ret = nonNestableNodes.indexOf(tagName) === -1;
                            ret = true;
                            break;
                        case 'form':
                            ret = nonNestableNodes.indexOf(tagName) === -1;
                            break;
                        case 'label':
                            ret = nonNestableNodes.indexOf(tagName) === -1;
                            break;
                        case 'legend':
                            ret = OjNode.parent.tagName === 'fieldset';
                            break;
                        case 'fieldset':
                            ret = tagName === 'legend' || nonNestableNodes.indexOf(tagName) === -1;
                            break;
                        case 'ol':
                            ret = tagName === 'li';
                            break;
                        case 'ul':
                            ret = tagName === 'li';
                            break;
                        case 'li':
                            ret = (OjNode.parent.tagName === 'ol' || OjNode.parent.tagName === 'ul') && nonNestableNodes.indexOf(tagName) === -1;
                            break;
                        case 'table':
                            ret = tagName === 'td' || tagName === 'tr' || tagName === 'tbody';
                            break;
                        case 'td':
                            ret = nonNestableNodes.indexOf(tagName) === -1;
                            break;
                    }
                    return ret;
                };
            }());

            var prepId = function(options, childTagName) {
                options = options || Object.create(null);
                OjInternal.count += 1;

                var id = OjNode.getId();
                if(options.name) {
                    id += options.name;
                }
                id += OjNode.tagName + OJ.to.string(childTagName) + OjInternal.count;

                Object.defineProperty(options, 'id', { value: id });
                return options;
            };

            if(isChildNodeTypeAllowed('a')){
                Object.defineProperty(OjNode, 'a', { value: function (opts) {
                    var childNode = OJ.elements.a(OjNode, prepId(opts, 'a'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('b')){
                Object.defineProperty(OjNode, 'b', { value: function (opts) {
                    var childNode = OJ.elements.b(OjNode, prepId(opts));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('br')){
                Object.defineProperty(OjNode, 'br', { value: function (opts) {
                    var childNode = OJ.elements.br(OjNode, prepId(opts));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('button')){
                Object.defineProperty(OjNode, 'button', { value: function (opts) {
                    var childNode = OJ.elements.button(OjNode, prepId(opts, 'button'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('div')){
                Object.defineProperty(OjNode, 'div', { value: function (opts) {
                    var childNode = OJ.elements.div(OjNode, prepId(opts, 'div'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('fieldSet')){
                Object.defineProperty(OjNode, 'fieldSet', { value: function (opts) {
                    var childNode = OJ.elements.fieldSet(OjNode, prepId(opts, 'fieldSet'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('form')){
                Object.defineProperty(OjNode, 'form', { value: function (opts) {
                    var childNode = OJ.elements.form(OjNode, prepId(opts, 'form'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('img')){
                Object.defineProperty(OjNode, 'img', { value: function (opts) {
                    var childNode = OJ.elements.img(OjNode, prepId(opts, 'img'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('input')){
                Object.defineProperty(OjNode, 'input', { value: function (opts) {
                    var childNode = OJ.elements.input(OjNode, prepId(opts, 'input'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('label')){
                Object.defineProperty(OjNode, 'label', { value: function (opts) {
                    var childNode = OJ.elements.label(OjNode, prepId(opts, 'label'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('li')){
                Object.defineProperty(OjNode, 'li', { value: function (opts) {
                    var childNode = OJ.elements.li(OjNode, prepId(opts, 'li'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('ol')){
                Object.defineProperty(OjNode, 'ol', { value: function (opts) {
                    var childNode = OJ.elements.ol(OjNode, prepId(opts, 'ol'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('option')){
                Object.defineProperty(OjNode, 'option', { value: function (opts) {
                    var childNode = OJ.elements.option(OjNode, prepId(opts, 'option'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('p')){
                Object.defineProperty(OjNode, 'p', { value: function (opts) {
                    var childNode = OJ.elements.p(OjNode, prepId(opts, 'p'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('select')){
                Object.defineProperty(OjNode, 'select', { value: function (opts) {
                    var childNode = OJ.elements.select(OjNode, prepId(opts, 'select'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('span')){
                Object.defineProperty(OjNode, 'span', { value: function (opts) {
                    var childNode = OJ.elements.span(OjNode, prepId(opts, 'span'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('table')){
                Object.defineProperty(OjNode, 'table', { value: function (opts) {
                    var childNode = OJ.elements.table(OjNode, prepId(opts, 'table'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('textArea')){
                Object.defineProperty(OjNode, 'textArea', { value: function (opts) {
                    var childNode = OJ.elements.textArea(OjNode, prepId(opts, 'textArea'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('ul')){
                Object.defineProperty(OjNode, 'ul', { value: function (opts) {
                    var childNode = OJ.elements.ul(OjNode, prepId(opts, 'ul'));
                    return childNode;
                }});
            }

            return OjNode;
        });

}());
/*global OJ:true*/
(function() {

    var optionsProto = (function() {
        var ret = Object.create(null);

        Object.defineProperty(ret, 'accesskey', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'class', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'contenteditable', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'contextmenu', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'draggable', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'dropzone', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'hidden', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'spellcheck', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'style', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'tabindex', {
            value: '',
            writable: true,
            enumerabl: true
        });

        Object.defineProperty(ret, 'title', {
            value: '',
            writable: true,
            enumerabl: true
        });

        return ret;
    }());

    OJ.node.lift('globalAttributes', function(options) {
        var globOpts = Object.create(optionsProto);
        var ret = globOpts;
        if(OJ.is.plainObject(options)) {
            Object.defineProperty(options, 'globalAttributes', {value: globOpts });
            ret = options;
        }
        return ret;
    });


}());
/*global OJ:true,$:true*/
(function () {

    OJ.makeSubNameSpace('node');

    OJ.node.lift('wrapper', function (OjNode, DomEl, options) {
            'use strict';
        if(!(OjNode && true === OjNode.isValid)) { //Don't try to wrap the same OjNode twice
            var OjInternal = {
                data: {},
                enabled: true,
                isValid: false
            };
            OjNode = OjNode || Object.create({ 0: null, $: $({}), isValid: false });

            (function _initConstructor() {
                //Validate and setup our Node instance
                if (OjNode[0] instanceof HTMLElement &&
                    OJ.is.jQuery(OjNode.$)) {
                    OjInternal.isValid = true;
                }
                else if (OJ.is.jQuery(DomEl)) {
                    Object.defineProperty(OjNode, '$', {
                        value: DomEl
                    });
                    Object.defineProperty(OjNode, '0', {
                        value: DomEl[0]
                    });
                    OjInternal.isValid = true;
                }
                else if (DomEl instanceof HTMLElement) {
                    Object.defineProperty(OjNode, '0', {
                        value: DomEl
                    });
                    Object.defineProperty(OjNode, '$', {
                        value: $('#' + DomEl.id)
                    });
                    OjInternal.isValid = true;
                } else {
                    OjInternal.isValid = false;
                    //No reason to continue. There is no juice to be had here.
                    throw new Error('Cannot make OJ without citrus fruit! OJ.node.wrapper was handed an invalid DOM handle.');
                }
            }()); //end initConstructor

            // No technical need to sequester the code in this way,
            // but it feels more readable in these blocks
            (function _postConstructor(){
                //We have a valid OjNode, let's build it out.
                Object.defineProperty(OjNode, 'isValid', {
                        value: OjInternal.isValid
                    });

                Object.defineProperty(OjNode, 'tagName', {
                    value: OjNode[0].tagName
                });

                Object.defineProperty(OjNode, 'childNodes', {
                        value: [],
                        writable: true
                    });

                // Keep this method safely enveloped in the closure.
                var buildChildNode = function(node, $element) {
                    node = node || Object.create(null);
                    // root and parent are safe assumptions
                    Object.defineProperty(node, 'root', {value: OjNode.root});
                    Object.defineProperty(node, 'parent', {value: OjNode });
                    if (OJ.is.jQuery($element)) {
                        // this is a valid child
                        Object.defineProperty(node, '$', {value: $element});
                        Object.defineProperty(node, '0', {value: $element[0]});

                    }
                    // Extend the child with the wrapper methods around itself
                    return  OJ.node.wrapper(node);
                };

                Object.defineProperty(OjInternal, 'chainChildNode', { value: function ($child) {
                    var newNode = Object.create(null);
                    buildChildNode(newNode, $child);
                    OjNode.childNodes.push(newNode);
                    return newNode;
                }});

                Object.defineProperty(OjInternal, 'wrapChildNode', { value: function ($child) {
                    var newNode = Object.create(null);
                    return buildChildNode(newNode, $child);
                }});

                /**
                 * Whether or no we have removed the node internally.
                 * This doesn't actually test the DOM,
                 * only our in-memory representation of the DOM.
                */
                Object.defineProperty(OjInternal, 'isNodeAlive', { value: function () {
                    return false === OJ.is.nullOrEmpty(OjNode);
                }});
            }());

            //Define some internal data methods
            Object.defineProperty(OjInternal, 'getDataProp', { value: function (propName) {
                var ret = null;
                if (OjInternal.isNodeAlive() &&
                    false === OJ.is.stringNullOrEmpty(propName)) {

                    if (OjNode[0] && OjNode[0].dataset && OjNode[0].dataset[propName]) {
                        ret = OjNode[0].dataset.propName;
                    }
                    if (OJ.is.stringNullOrEmpty(ret)) {
                        ret = OjInternal.data[propName] ||
                            OjNode.$.data(propName) ||
                            OJ.localStorage.getItem(propName + '_control_data_' + OjNode.getId());
                    }
                }
                return ret;
            }});

            Object.defineProperty(OjInternal, 'setDataProp', { value: function (propName, value) {
                var ret = null;
                if (OjInternal.isNodeAlive() &&
                    false === OJ.is.stringNullOrEmpty(propName)) {
                    ret = value;
                    if (OjNode[0] && OjNode[0].dataset) {
                        OjNode[0].dataset[propName] = value;

                        OjInternal.data[propName] = value;
                    } else {
                        OjInternal.data[propName] = value;
                        OjNode.$.data(propName, value);
                    }
                }
                return ret;
            }});

            Object.defineProperty(OjInternal, 'setDataProperties', { value: function (obj) {
                if(obj && Object.keys(obj)) {
                    Object.keys(obj).forEach(function (key, val) {
                        OjInternal.setDataProp(key, val);
                    });
                }
            }});


            /**
              OJ doesn't need many jQuery selectors,
              but when it does they are sequestered on this property to "try" to avoid confusion.
            */
            var el = Object.create(null);

            Object.defineProperty(el, 'children', {value: function (searchTerm, selector) {
                var ret = [];
                if (OjInternal.isNodeAlive()) {
                    var $children = OjNode.$.children(OJ.to.string(searchTerm), OJ.to.string(selector));
                    if($children) {
                        $children.each(function() {
                            var $child = $(this);
                            ret.push(OjInternal.chainChildNode($child));
                        });
                    }
                }
                return ret;
            }});

            Object.defineProperty(el, 'filter', { value: function (selector) {
                var ret = [];
                if (selector && OjInternal.isNodeAlive()) {
                    var $children = OjNode.$.filter(selector);
                    if($children.length > 0) {
                        $children.each(function() {
                            var $child = $(this);
                            ret.push(OjInternal.wrapChildNode($child));
                        });
                    }
                }
                return ret;
            }});

            Object.defineProperty(el, 'find', { value: function (selector) {
                var ret = [];
                if (selector && OjInternal.isNodeAlive()) {
                    var $children = OjNode.$.find(selector);
                    if($children.length > 0) {
                        $children.each(function() {
                            var $child = $(this);
                            ret.push(OjInternal.wrapChildNode($child));
                        });
                    }
                }
                return ret;
            }});

            Object.defineProperty(el, 'first', { value: function () {
                var ret = OjNode.childNodes[0] || OjNode.el.children[0];
                return ret;
            }});

            Object.defineProperty(el, 'parent', { value: function () {
                var ret = {};
                if (OjInternal.isNodeAlive()) {
                    var $parent = OjNode.$.parent();

                    if (false === OJ.is.nullOrEmpty($parent) && $parent.length > 0) {
                        ret = OJ.dom.nodeWrapper({}, $parent);
                    }
                }
                return ret;
            }});

            /**
                OJ implements these wrappers around jQuery methods to provide better chaining on OJ Nodes,
                as well as to make it easy to swap out the DOM framework without having to change the interfaces
            */
            Object.defineProperty(OjNode, 'addClass', { value: function (name) {
                if (name && OjInternal.isNodeAlive()) {
                    OjNode.$.addClass(name);
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'append', { value: function (object) {
                var ret = OjNode;
                if (object && OjInternal.isNodeAlive()) {
                    OJ.tryThisThenThat(function _first() {
                        OjNode.$.append(object);
                        ret = OjInternal.chainChildNode(object);
                    }, function _second() {
                        //Probably attempted to append a string which matched a selector (e.g. 'a')
                        //which will attempt to (and fail to) append all <a> nodes to this one.
                        if (OJ.is.string(object)) {
                            OjNode.text(object);
                        }
                    });
                }
                return ret;
            }});

            Object.defineProperty(OjNode, 'attr', { value: function (name, value) {
                var ret = null;
                if (name && OjInternal.isNodeAlive()) {
                    ret = OjNode;

                    if(OJ.is.plainObject(name)) {
                        OjNode.$.attr(name);
                    } else  if(arguments.length === 1) {
                        ret = OjNode.$.attr(name);
                    } else {
                        OjNode.$.attr(name, value);
                    }
                }
                return ret;
            }});

            Object.defineProperty(OjNode, 'attach', { value: function (object) {
                var $child = null, ret;
                if (object && OjInternal.isNodeAlive()) {
                    OJ.tryThisThenThat(function _first() {
                        $child = $(object);
                        if (false === OJ.is.nullOrEmpty($child)) {
                            OjNode.append($child);
                            ret = OjInternal.chainChildNode($child);
                        }
                    }, function _second() {

                    });
                }
                return ret;
            }});

            Object.defineProperty(OjNode, 'bind', {value : function (eventName, event) {
                if (eventName && OjInternal.isNodeAlive()) {
                    OjNode.$.on(eventName, event);
                }
                return OjNode;
            }});
            Object.defineProperty(OjNode, 'on', {value : OJ.bind });

            Object.defineProperty(OjNode, 'clickOnEnter', {value: function (anOjNode) {
                if (anOjNode &&  OjInternal.isNodeAlive()) {
                    OjNode.$.clickOnEnter(anOjNode.$);
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'css', { value: function (param1, param2) {
                var ret = OjNode;
                if (param1 && OjInternal.isNodeAlive()) {
                    if (OJ.is.plainObject(param1)) {
                        OjNode.$.css(param1);
                    } else if(arguments.length === 1) {
                        ret = OjNode.$.css(param1);
                    } else {
                        OjNode.$.css(param1, param2);
                    }
                }
                return ret;
            }});

            Object.defineProperty(OjNode, 'data', { value: function (prop, val) {
                var ret = '';
                if (prop && OjInternal.isNodeAlive()) {
                    if (OJ.is.plainObject(prop)) {
                        OjInternal.setDataProperties(prop);
                    } else {
                        switch (arguments.length) {
                            case 1:
                                ret = OjInternal.getDataProp(prop);
                                break;
                            case 2:
                                OjInternal.setDataProp(prop, val);
                                ret = OjNode;
                                break;
                        }
                    }
                }
                return ret;

            }});

            Object.defineProperty(OjNode, 'disable', { value: function () {
                if (OjInternal.isNodeAlive()) {
                    OjInternal.enabled = false;
                    OjNode.addClass('OjDisabled');
                    OjNode.attr('disabled', 'disabled');
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'empty', { value: function () {
                if (OjInternal.isNodeAlive()) {
                    OjNode.$.empty();
                    OjNode.childNodes = [];
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'enable', { value:  function () {
                if (OjInternal.isNodeAlive()) {
                    OjInternal.enabled = true;
                    OjNode.removeClass('OjDisabled');
                    OjNode.removeAttr('disabled');
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'getId', { value: function () {
                var ret = '';
                if (OjInternal.isNodeAlive()) {
                    ret = OjNode[0].id;
                }
                return ret;
            }});

            Object.defineProperty(OjNode, 'hide', { value: function () {
                if (OjInternal.isNodeAlive()) {
                    OjNode.addClass('OjHidden');
                    OjNode.$.hide();
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'length', { value: function () {
                var ret = 0;
                if (OjInternal.isNodeAlive()) {
                    ret = OJ.to.number(OjNode.$.length);
                }
                return ret;
            }});

            Object.defineProperty(OjNode, 'prop', { value: function (name, value) {
                var ret = null;
                if (name && OjInternal.isNodeAlive()) {
                    ret = OjNode;

                    if(OJ.is.plainObject(name)) {
                        OjNode.$.prop(name);
                    } else  if(arguments.length === 1) {
                        ret = OjNode.$.prop(name);
                    } else {
                        OjNode.$.prop(name, value);
                    }
                }
                return ret;
            }});

            Object.defineProperty(OjNode, 'remove', { value: function () {
                if(OjNode && OjNode.$) {
                    OjNode.$.remove();
                    OjNode.childNodes = [];
                    //This will update the internal reference to the node,
                    //which will allow isNodeAlive() to work as expected;
                    //however, it won't delete outstanding references to the Node.
                    //But that's OK. The GC will clean-up just fine.
                    OjNode = null;
                }
                return null;
            }});

            Object.defineProperty(OjNode, 'removeClass', { value: function (name) {
                if (name && OjInternal.isNodeAlive()) {
                    OjNode.$.removeClass(name);
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'removeProp', { value: function (name) {
                if (name && OjInternal.isNodeAlive()) {
                    OjNode.$.removeProp(name);
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'removeAttr', { value: function (name) {
                if (name && OjInternal.isNodeAlive()) {
                    OjNode.$.removeAttr(name);
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'show', { value: function () {
                if (OjInternal.isNodeAlive()) {
                    OjNode.removeClass('OjHidden');
                    OjNode.$.show();
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'text', { value: function (text) {
                if (text && OjInternal.isNodeAlive()) {
                    if (arguments.length === 1 && false === OJ.is.nullOrUndefined(text)) {
                        OjNode.$.text(text);
                        return OjNode;
                    } else {
                        return OJ.to.string(OjNode.$.text());
                    }
                }
            }});

            Object.defineProperty(OjNode, 'toggle', { value: function () {
                if (OjInternal.isNodeAlive()) {
                    OjNode.$.toggle();
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'toggleEnable', { value: function () {
                if (OjInternal.isNodeAlive()) {
                    if (OjInternal.enabled) {
                        OjNode.disable();
                    } else {
                        OjNode.enable();
                    }
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'trigger', { value: function (eventName, eventOpts) {
                if (eventName && OjInternal.isNodeAlive()) {
                    OjNode.$.trigger(eventName, eventOpts);
                }
                return OjNode;
            }});

            Object.defineProperty(OjNode, 'unbind', { value: function (eventName, event) {
                if (eventName && OjInternal.isNodeAlive()) {
                    OjNode.$.off(eventName, event);
                }
                return OjNode;
            }});
            Object.defineProperty(OjNode, 'off', { value:  OjNode.unbind });

            Object.defineProperty(OjNode, 'valueOf', { value: function () {
                return OjNode;
            }});

            /**
             * Individual DOM classes will need to override this method.
            */
            OjNode.val = OjNode.val || function (value) {
                if (OjInternal.isNodeAlive()) {
                    if (arguments.length === 1 && false === OJ.is.nullOrUndefined(value)) {
                        OjNode.$.val(value);
                        return OjNode;
                    } else {
                        return OJ.to.string(OjNode.$.val());
                    }
                }
            };

            /**
             * This is THE mechanism for building out the DOM.
             * OJ may later support *pend methods, but for now it's turtles all the way down.
             */
            Object.defineProperty(OjNode, 'addChild', { value: function (object) {
                return OjNode.append(object);
            }});

            //Finally! Return something.
            return OJ.node.factory(OjNode);
        }
    });

} ());



// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
