(function() {

    window.OrangeJuice = window.OJ = (function() {
        'use strict';
        var OjPrivate = {
            methods: ['lift']
        };

        var OjOut = { };

        function makeNameSpace(externalCollection, anInternalCollection) {
            'use strict';
            var internalCollection = {
                methods: ['lift']
            };
            anInternalCollection = anInternalCollection || {};
            $.extend(anInternalCollection, internalCollection);
            
            externalCollection = externalCollection || { };

            externalCollection.lift = externalCollection.lift ||
                Object.create(externalCollection, name, function(name, obj) {
                    /// <summary>
                    ///  Lift an Object into an OrangeJuice namespace
                    /// </summary>
                    /// <param name="name" type="String"> Name of the object </param>
                    /// <param name="obj" type="Object"> Object to pass </param>
                    /// <returns type="Boolean">True if the object name did not already exist in the namespace.</returns>
                    'use strict';
                    var succeeded = false;
					if(name && obj) {
						if (internalCollection.methods.indexOf(name) === -1) {
							internalCollection.methods.push(name);
							Object.defineProperty(obj, 'type', {
								value: name 
							});
							Object.defineProperty(externalCollection, name, obj);
							succeeded = true;
						} else {
							//throw, object is already defined
						}
					}
                    return obj;
                });
            
            externalCollection.makeSubNameSpace = externalCollection.makeSubNameSpace ||
                externalCollection.lift('makeSubNameSpace', function(subNameSpace, optionalReturn) {
						return externalCollection.makeNameSpace(optionalReturn);
					});
				});
            return externalCollection;
        }

        makeNameSpace(OjOut, OjPrivate);

		OjOut.is = OjOut.is || OjOut.makeSubNameSpace('is');
		
        OjOut.is.func = OjOut.is.func ||
            OjOut.is.lift('func', function(obj) {
                'use strict';
                /// <summary> Returns true if the object is a function</summary>
                /// <param name="obj" type="Object"> Object to test</param>
                /// <returns type="Boolean" />
                var ret = ($.isFunction(obj));
                return ret;
            });

        OjOut.tryExec = OjOut.tryExec ||
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

        OjOut.method = OjOut.method ||
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