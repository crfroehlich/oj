/*global OJ:true, jQuery: true, window: true */
(function(domVendor) {

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

            var prototype = Object.create(null);

            /**
             *	Internal OJ method to create new "sub" namespaces on arbitrary child objects.
             *	@param (Object) proto An instance of an Object to use as the basis of the new namespace prototype
             */
            var makeNameSpace = function(proto) {
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
                proto['lift'] = function(name, obj) {
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
                    }
                    return obj;
                };

                /**
                 *	Create a new, static namespace on the current parent (e.g. OJ.to... || OJ.is...)
                 *   @param (String) subNameSpace The name of the new namespace.
                 *   @return (Object) The new namespace.
                 */
                proto['makeSubNameSpace'] = function(subNameSpace) {
                    'use strict';
                    /// <summary>Create a new, static namespace on the current parent (e.g. OJ.to... || OJ.is...).</summary>
                    /// <param name="subNameSpace" type="String">The name of the new namespace.</param>
                    /// <returns type="Object">The new namespace.</returns>
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
            OjOut.lift('?', domVendor);

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