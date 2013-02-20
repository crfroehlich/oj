/*global OJ:true, jQuery: true, window: true */
(function (domVendor) {

    /**
     *    The OJ  NameSpace, an IIFE
     *    @namespace
     *    @export
     *    @return {window.OJ}
     */
    Object.defineProperty(window, 'OJ', {
        value: (function OJ() {
            ///<summary>(IIFE) Intializes the OJ namespace.</summary>
            ///<returns type="window.OJ">The OJ namespace.</returns>

            var OjInternal = {
                dependents: []
            };

            Object.defineProperty(OjInternal, 'getOjMembers', {
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
                    Object.keys(OjTree['OJ']).forEach(function (key) {
                        if (domVendor.isPlainObject(OjTree['OJ'][key])) {
                            recurseTree(OjTree['OJ'][key], 'OJ');
                        }
                    });
                    return members;
                }
            });

            Object.defineProperty(OjInternal, 'alertDependents', {
                value: function (imports) {
                    var deps = OjInternal.dependents.filter(function (depOn) {
                        return false === depOn(imports);
                    });
                    if (Array.isArray(deps)) {
                        OjInternal.dependents = deps;
                    }
                }
            });

            var OjTree = Object.create(null);
            OjTree['OJ'] = Object.create(null);

            var prototype = Object.create(null);

            /**
             *	Internal OJ method to create new "sub" namespaces on arbitrary child objects.
             *	@param (Object) proto An instance of an Object to use as the basis of the new namespace prototype
             */
            var makeNameSpace = function (proto, tree, spacename) {
                /// <summary>Internal OJ method to create new "sub" namespaces on arbitrary child objects.</summary>
                /// <param name="proto" type="Object"> String to parse </param>
                /// <returns type="Object">The new child namespace.</returns>
                proto = proto || Object.create(null);

                var ret = Object.create(proto);

                /**
                 *	"Lift" an Object into the prototype of the namespace.
                 *	This Object will be readable/executable but is otherwise immutable.
                 *   @param (String) name The name of the object to lift
                 *   @param (Object) obj Any, arbitrary Object to use as the value.
                 *   @return (Object) The value of the new property.
                 */
                Object.defineProperty(proto, 'lift', {
                    value: function (name, obj) {
                        'use strict';
                        /// <summary>"Lift" an Object into the prototype of the namespace. This Object will be readable/executable but is otherwise immutable.</summary>
                        /// <param name="name" type="String">The name of the object to lift.</param>
                        /// <param name="obj" type="Object">Any, arbitrary Object to use as the value.</param>
                        /// <returns type="Object">The value of the new property.</returns>
                        if (name && obj) {
                            Object.defineProperty(ret, name, {
                                value: obj,
                                writable: false,
                                enumerable: false,
                                configurable: false
                            });
                            tree[name] = typeof (obj);
                            OjInternal.alertDependents('OJ.' + spacename + '.' + name);
                        }
                        return obj;
                    }
                });

                /**
                 *	Create a new, static namespace on the current parent (e.g. OJ.to... || OJ.is...)
                 *   @param (String) subNameSpace The name of the new namespace.
                 *   @return (Object) The new namespace.
                 */
                Object.defineProperty(proto, 'makeSubNameSpace', {
                    value: function (subNameSpace) {
                        'use strict';
                        /// <summary>Create a new, static namespace on the current parent (e.g. OJ.to... || OJ.is...).</summary>
                        /// <param name="subNameSpace" type="String">The name of the new namespace.</param>
                        /// <returns type="Object">The new namespace.</returns>
                        tree[subNameSpace] = Object.create(null);
                        OjInternal.alertDependents('OJ.' + subNameSpace);
                        return Object.defineProperty(ret, subNameSpace, {
                            value: makeNameSpace(null, tree[subNameSpace], subNameSpace),
                            writable: false,
                            enumerable: false,
                            configurable: false
                        });
                    }
                });

                return ret;
            };

            var OjOut = makeNameSpace(prototype, OjTree['OJ']);

            OjOut.lift('?', domVendor);


            /**
             *    "Depend" an Object upon another member of this namespace, upon another namespace,
             *   or upon a member of another namespace
             *   @param (Array) array of dependencies for this method
             *   @param (Function) obj Any, arbitrary Object to use as the value
             */
            var dependsOn = function (dependencies, callBack, imports) {
                'use strict';
                var ret = false;
                var OjMembers = OjInternal.getOjMembers();
                if (dependencies && dependencies.length > 0 && callBack) {
                    var missing = dependencies.filter(function (depen) {
                        return (OjMembers.indexOf(depen) === -1 && (!imports || imports !== depen));
                    });
                    if (missing.length === 0) {
                        ret = true;
                        callBack();
                    }
                    else {
                        OjInternal.dependents.push(function (imports) {
                            return dependsOn(missing, callBack, imports);
                        });
                    }
                }
                return ret;
            };
            Object.defineProperty(OjOut, 'dependsOn', {
                value: dependsOn
            });


            Object.defineProperty(OjOut, 'tree', {
                value: OjTree
            });

            return OjOut;

        }())
    });

    OJ.makeSubNameSpace('errors');

    OJ.makeSubNameSpace('is');


    /**
     * The MetaData namespace. Represents the structures of OJ nodes, elements and properties.
     */
    OJ.makeSubNameSpace('metadata');

    /**
     * The node namespace. Represents an OJ Node and its properties.
     * [1]: This class is responsible for constructing the DOM getters (properties on this object which reference Nodes in the DOM tree)
     * [2]: This class exposes helper methods which can get/set properties on this instance of the node.
     * [3]: This class validates the execution of these methods (e.g. Is the node still in the DOM; has it been GC'd behind our backs)
     * [4]: Maintaining an im-memory representation of tree with children/parents
     */
    OJ.makeSubNameSpace('node');

    OJ.makeSubNameSpace('to');


}(jQuery));