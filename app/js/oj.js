(function() {

    window.OrangeJuice = window.OJ = (function() {
        'use strict';
        var OjPrivate = {
            methods: ['lift']
        };

        var prototype = Object.create(null);

        function makeNameSpace(proto) {
            'use strict';
            
            proto = proto || Object.create(null);

            var ret = Object.create(proto);
            
            proto['lift'] = function(name, obj) {
                /// <summary>
                ///  Lift an Object into an OrangeJuice namespace
                /// </summary>
                /// <param name="name" type="String"> Name of the object </param>
                /// <param name="obj" type="Object"> Object to pass </param>
                /// <returns type="Boolean">True if the object name did not already exist in the namespace.</returns>
                'use strict';
                var succeeded = false;
				if(name && obj) {
					Object.defineProperty(ret, name, { 
                        value: obj,
                        writable: false,
                        enumerable: false,
                        configurable: false
                    });
                    //proto[name] = obj;
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
                //return makeNameSpace(proto);
			};
            return ret;
        };

        var OjOut = makeNameSpace(prototype);

		OjOut.makeSubNameSpace('is');
		        
        OjOut.is.lift('func', function(obj) {
            'use strict';
            /// <summary> Returns true if the object is a function</summary>
            /// <param name="obj" type="Object"> Object to test</param>
            /// <returns type="Boolean" />
            var ret = ($.isFunction(obj));
            return ret;
        });

    
        OjOut.lift('tryExec', function(func) {
            'use strict';
            /// <summary> If the supplied argument is a function, execute it. </summary>
            /// <param name="func" type="Function"> Function to evaluate </param>
            /// <returns type="undefined" />
            var ret = false;
            try {
                if (OJ.is.func(func)) {
                    ret = func.apply(this, Array.prototype.slice.call(arguments, 1));
                }
            } catch(exception) {
                if ((exception.name !== 'TypeError' ||
                    exception.type !== 'called_non_callable') &&
                    exception.type !== 'non_object_property_load') { /* ignore errors failing to exec self-executing functions */
                    OJ.error.catchException(exception);
                }
            } finally {
                return ret;
            }
        });

    
        OjOut.lift('method', function(func) {
            'use strict';
            var that = this;
            return function() {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift(func);
                return OJ.tryExec.apply(that, args);
            };
        });

        return OjOut;

    }());

}());