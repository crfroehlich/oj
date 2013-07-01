/*global nameSpaceName:true, jQuery: true, window: true */
(function (nameSpaceName, domVendor) {

    Object.defineProperties(Object.prototype, {
        getInstanceName: {
            value: function () {
                var funcNameRegex = /function (.{1,})\(/;
                var results = (funcNameRegex).exec((this).constructor.toString());
                return (results && results.length > 1) ? results[1] : "";
            }
        }
    });

    /**
     * An internal representation of the namespace tree
     * @internal
    */
    var NsTree = {};

    /**
     *    The nameSpaceName  NameSpace, an IIFE
     *    @namespace
     *    @export
     *    @global */ +nameSpaceName + /*
     *    @return {window.nameSpaceName}
     */
    Object.defineProperty(window, nameSpaceName, {
        value:
            /**
             * Intializes the nameSpaceName namespace.
             * @return {window.nameSpaceName}
            */
            (function () {

                var nsInternal = {
                    dependents: []
                };

                Object.defineProperty(nsInternal, 'getNsMembers', {
                    value:
                        /**
                         * Fetches the registered properties and methods on the namespace and its child namespaces
                         * @interal
                         * @return {Array} An array of members defined as strings (e.g. 'namespace.constants.astringcnst')
                        */
                        function () {
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
                    value:
                        /**
                         * To support dependency management, when a property is lifted onto the namespace, notify dependents to initialize
                         * @internal
                        */
                        function (imports) {
                        var deps = nsInternal.dependents.filter(function (depOn) {
                            return false === depOn(imports);
                        });
                        if (Array.isArray(deps)) {
                            nsInternal.dependents = deps;
                        }
                    }
                });

                /**
                 * Internal nameSpaceName method to create new "sub" namespaces on arbitrary child objects.
                 * @internal	
                 * @param spacename {String} the namespace name
                 * @param tree {Object} the internal tree representation of the current level of the namespace
                 * @return namespace {Object} A new namespace
                 */
                function makeNameSpace(spacename, tree) {
                    /**
                     * An internal mechanism to represent the instance of this namespace
                     * @constructor
                    */
                    var Class = new Function(
                        "return function " + spacename + "(){}"
                    )();
                    
                    /**
                     * The derived instance to be constructed
                     * @constructor
                    */
                    function Base(nsName) {
                        var proto = this;
                        tree[nsName] = tree[nsName] || {};
                        var nsTree = tree[nsName];

                        Object.defineProperty(this, 'register', {
                            value:
                                /**
                                 *	Register (e.g. "Lift") an Object into the prototype of the namespace.
                                 *	This Object will be readable/executable but is otherwise immutable.
                                 *   @param {String} name The name of the object to lift
                                 *   @param {Object} obj Any, arbitrary Object to use as the value.
                                 *   @return {Object} The value of the new property.
                                 */
                                function (name, obj, enumerable) {
                                    'use strict';
                                    if (!(typeof name === 'string') || name === '') {
                                        throw new Error('Cannot lift a new property without a valid name.');
                                    }
                                    if (!obj) {
                                        throw new Error('Cannot lift a new property without a valid property instance.');
                                    }
                                    if (proto[name]) {
                                        throw new Error('Property named ' + name + ' is already defined on ' + spacename + '.');
                                    }

                                    //Guard against obliterating the tree as the tree is recursively extended
                                    nsTree[name] = nsTree[name] || {
                                        name: name,
                                        type: typeof obj,
                                        instance: obj.getInstanceName ? obj.getInstanceName() : 'unknown'
                                    };

                                    Object.defineProperty(proto, name, {
                                        value: obj,
                                        enumerable: false !== enumerable
                                    });
                                    nsInternal.alertDependents(nsName + '.' + spacename + '.' + name);

                                    return obj;
                                }
                        });

                        proto.register('makeSubNameSpace',
                            /**
                             *	Create a new, static namespace on the current parent (e.g. nsName.to... || nsName.is...)
                             *   @param {String} subNameSpace The name of the new namespace.
                             *   @return {Object} The new namespace.
                             */
                            function (subNameSpace) {
                                'use strict';
                                if (!(typeof subNameSpace === 'string') || subNameSpace === '') {
                                    throw new Error('Cannot create a new sub namespace without a valid name.');
                                }
                                if (proto.subNameSpace) {
                                    throw new Error('Sub namespace named ' + subNameSpace + ' is already defined on ' + spacename + '.');
                                }
                                nsInternal.alertDependents(nsName + '.' + subNameSpace);

                                var newNameSpace = makeNameSpace(subNameSpace, nsTree);

                                if (subNameSpace !== 'constants') {
                                    newNameSpace.register('constants', makeNameSpace('constants', nsTree), false);
                                }

                                proto.register(subNameSpace, newNameSpace, false);
                                return newNameSpace;
                            }, false);
                    }

                    Class.prototype = new Base(spacename);
                    //Class.prototype.parent = Base.prototype;

                    return new Class(spacename);
                };

                //Create the root of the tree as the current namespace
                NsTree[nameSpaceName] = {};

                //Define the core namespace and the return of this class
                var NsOut = makeNameSpace(nameSpaceName, NsTree[nameSpaceName]);
                Object.defineProperties(window, { $nameSpace$: { value: NsOut } });

                //Cache a handle on the vendor (probably jQuery) on the root namespace
                NsOut.register('?', domVendor, false);
                
                //Cache the tree (useful for documentation/visualization/debugging)
                NsOut.register('tree', NsTree[nameSpaceName], false);
                
                //Cache the name space name
                NsOut.register('name', nameSpaceName, false);


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
                NsOut.register('dependsOn', dependsOn, false);

                return NsOut;

            }())
    });

}('OJ', jQuery));