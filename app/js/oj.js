/*global nameSpaceName:true, jQuery: true, window: true */
(function (nameSpaceName, domVendor) {

    /**
     *    The nameSpaceName  NameSpace, an IIFE
     *    @namespace
     *    @export
     *    @return {window.nameSpaceName}
     */
    Object.defineProperty(window, nameSpaceName, {
        value: (function () {
            ///<summary>(IIFE) Intializes the nameSpaceName namespace.</summary>
            ///<returns type="window.nameSpaceName">The nameSpaceName namespace.</returns>

            var nsInternal = {
                dependents: []
            };

            Object.defineProperty(nsInternal, 'getNsMembers', {
                value: function () {
                    var members = [];

                    function recurseTree(key, lastKey) {
                        if (typeof (key) === 'string') {
                            members.push(lastKey + '.' + key);
                        }
                        if (domVendor.isPlainObject(key)) {
                            Object.keys(key).forEach(function (k) {
                                if (typeof (k) === 'string') {
                                    members.push(lastKey + '.' + k);
                                }
                                if (domVendor.isPlainObject(key[k])) {
                                    recurseTree(key[k], lastKey + '.' + k);
                                }
                            });
                        }
                    }
                    Object.keys(NsTree[nameSpaceName]).forEach(function (key) {
                        if (domVendor.isPlainObject(NsTree[nameSpaceName][key])) {
                            recurseTree(NsTree[nameSpaceName][key], nameSpaceName);
                        }
                    });
                    return members;
                }
            });

            Object.defineProperty(nsInternal, 'alertDependents', {
                value: function (imports) {
                    var deps = nsInternal.dependents.filter(function (depOn) {
                        return false === depOn(imports);
                    });
                    if (Array.isArray(deps)) {
                        nsInternal.dependents = deps;
                    }
                }
            });

            /**
             *    Internal nameSpaceName method to create new "sub" namespaces on arbitrary child objects.
             *	@param spacename {String} the namespace name
             */
            function makeNameSpace(spacename) {
                /// <summary>Internal nameSpaceName method to create new "sub" namespaces on arbitrary child objects.</summary>
                /// <param name="proto" type="Object"> String to parse </param>
                /// <returns type="Object">The new child namespace.</returns>
                var Class = new Function(
                    "return function " + spacename + "(){}"
                )();
                function Base(nsName) {
                    var proto = this;
                    Object.defineProperty(this, 'lift', {
                        value:
                            /**
                             *	"Lift" an Object into the prototype of the namespace.
                             *	This Object will be readable/executable but is otherwise immutable.
                             *   @param {String} name The name of the object to lift
                             *   @param {Object} obj Any, arbitrary Object to use as the value.
                             *   @return {Object} The value of the new property.
                             */
                            function (name, obj, enumerable) {
                                'use strict';
                                /// <summary>"Lift" an Object into the prototype of the namespace. This Object will be readable/executable but is otherwise immutable.</summary>
                                /// <param name="name" type="String">The name of the object to lift.</param>
                                /// <param name="obj" type="Object">Any, arbitrary Object to use as the value.</param>
                                /// <returns type="Object">The value of the new property.</returns>
                                if (!(typeof name === 'string') || name === '') {
                                    throw new Error('Cannot lift a new property without a valid name.');
                                }
                                if (!obj) {
                                    throw new Error('Cannot lift a new property without a valid property instance.');
                                }
                                    Object.defineProperty(proto, name, {
                                        value: obj,
                                        enumerable: false !== enumerable
                                    });
                                    nsInternal.alertDependents(nsName + '.' + spacename + '.' + name);
                                
                                return obj;
                            }
                    });

                    proto.lift('makeSubNameSpace',
                        /**
                         *	Create a new, static namespace on the current parent (e.g. nsName.to... || nsName.is...)
                         *   @param {String} subNameSpace The name of the new namespace.
                         *   @return {Object} The new namespace.
                         */
                        function (subNameSpace) {
                            'use strict';
                            /// <summary>Create a new, static namespace on the current parent (e.g. nsName.to... || nsName.is...).</summary>
                            /// <param name="subNameSpace" type="String">The name of the new namespace.</param>
                            /// <returns type="Object">The new namespace.</returns>
                            if (!(typeof subNameSpace === 'string') || subNameSpace === '') {
                                throw new Error('Cannot create a new sub namespace without a valid name.');
                            }
                            nsInternal.alertDependents(nsName + '.' + subNameSpace);

                            var newNameSpace = makeNameSpace(subNameSpace);

                            newNameSpace.lift('constants', makeNameSpace('constants'));

                            proto.lift(subNameSpace, newNameSpace);
                            return newNameSpace;
                        }, false);
                }

                Class.prototype = new Base(spacename);
                //Class.prototype.parent = Base.prototype;
                
                return new Class(spacename);
            };

            var NsOut = makeNameSpace(nameSpaceName);

            NsOut.lift('constants', makeNameSpace('constants'));

            NsOut.lift('?', domVendor);


            /**
             *    "Depend" an Object upon another member of this namespace, upon another namespace,
             *   or upon a member of another namespace
             *   @param (Array) array of dependencies for this method
             *   @param (Function) obj Any, arbitrary Object to use as the value
             */
            function dependsOn(dependencies, callBack, imports) {
                'use strict';
                var ret = false;
                var nsMembers = nsInternal.getNsMembers();
                if (dependencies && dependencies.length > 0 && callBack) {
                    var missing = dependencies.filter(function (depen) {
                        return (nsMembers.indexOf(depen) === -1 && (!imports || imports !== depen));
                    });
                    if (missing.length === 0) {
                        ret = true;
                        callBack();
                    }
                    else {
                        nsInternal.dependents.push(function (imports) {
                            return dependsOn(missing, callBack, imports);
                        });
                    }
                }
                return ret;
            };
            NsOut.lift('dependsOn', dependsOn, false);
            
            return NsOut;

        }())
    });

}('OJ', jQuery));