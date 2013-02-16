/*global OJ:true */
(function () {

    /***
     * The unsanitized base class for the representation of a DOM element at the highest level.
     */
    var NodeAbstract = function (id, el, _el$) {
        'use strict';
        ///<summary>An abstract representation of a Node that defers validation until assignment.</summary>
        ///<returns type="EntityAbstract">An EntityAbstract</returns>
        var entity = this;
        var _id = '';
        Object.defineProperty(entity, 'id', {
            set: function (val) {
                if (false === OJ.is.string(val)) {
                    throw new TypeError('DOM Element Identifiers must be Strings');
                }
                if (_id.length > 0) {
                    OJ.errors.AssignmentError('DOM Element Identifiers cannot be changed once assigned.');
                }
                _id = val;
                if (null === entity[0]) {
                    entity[0] = document.getElementById(val);
                }
                if (null === entity['?']) {
                    entity['?'] = OJ.to.vendorDomObject(val);
                }
            },
            get: function () {
                return _id;
            }
        });

        var _el = null;
        Object.defineProperty(entity, '0', {
            set: function (val) {
                if (false === val instanceof HTMLElement) {
                    throw new TypeError('Invalid assignment. Element must be of type HTMLElement.');
                }
                if (OJ.is.stringNullOrEmpty(entity.id)) {
                    entity.id = val.id;
                }
                if (null === entity['?']) {
                    _el$ = OJ.to.vendorDomObject(_id);
                }
                entity['?'] = val;
            },
            get: function () {
                return _el;
            }
        });

        var _el$ = null;
        Object.defineProperty(entity, '?', {
            set: function (val) {
                if (false === OJ.is.vendorObject(val)) {
                    throw new TypeError('Invalid assignment. Vendor element must match the current vendor framework.');
                }
                if (OJ.is.stringNullOrEmpty(entity.id)) {
                    entity.id = val[0].id;
                }
                if (null === entity[0]) {
                    _el = val[0];
                }
                entity[0] = val;
            },
            get: function () {
                return _el$;
            }
        });
        if (id) {
            entity.id = id;
        }
        if (el) {
            entity[0] = el;
        }
        else if (_el$) {
            entity['?'] = _el$;
        }

        return entity;
    };

    OJ.metadata.lift('NodeAbstract', NodeAbstract);

    //    /***
    //     * A sanitized representation of a DOM element at the highest level.
    //     * This class is intended to communicate the path from an Abstract Node entity to an Instance entity.
    //     * Unlike EntityAbstract, this representation of a DOM node must be in the DOM.
    //     */
    //    var NodeInstance = OJ.Class('NodeInstance', NodeAbstract, function (id, el, _$el) {
    //        'use strict';
    //        ///<summary>Validates a candidate to be cast as an OJ Node</summary>
    //        ///<param name="id" type="String">Element ID</param>
    //        ///<param name="el" type="HTMLElement">Element instance</param>
    //        ///<param name="_$el" type="_$">Element cast as a Vendor object</param>
    //        ///<returns type="NodeInstance">A validated NodeInstance</returns>
    //        var entity = this;
    ////        entity.prototype = new NodeAbstract();
    ////        entity.__proto__ = new NodeAbstract();
    ////        entity.prototype.constructor = NodeInstance;
    //
    //        /***
    //         * Validate the inputs and guarantee that (if valid),
    //         * the response will have an element id, an element and a vendor instance of the element
    //         */
    //        if (false === OJ.is.stringNullOrEmpty(id)) {
    //            if (false === (el instanceof HTMLElement && OJ.is.vendorObject(_$el))) {
    //                if (false === (el instanceof HTMLElement && OJ.is.vendorObject(_$el))) {
    //                    el = document.getElementById(id);
    //                    _$el = OJ.to.vendorDomObject(id);
    //                }
    //                else {
    //                    if (false === (el instanceof HTMLElement)) {
    //                        el = document.getElementById(id);
    //                    }
    //                    else {
    //                        _$el = OJ.to.vendorDomObject(id);
    //                    }
    //                }
    //            }
    //        }
    //        else {
    //            if (el instanceof HTMLElement) {
    //                id = el.id;
    //                if (false === OJ.is.vendorObj(_$el)) {
    //                    _$el = OJ.to.vendorDomObject(id);
    //                }
    //            }
    //            else {
    //                if (OJ.is.vendorObj(_$el)) {
    //                    el = _$el[0];
    //                    id = el.id;
    //                }
    //            }
    //        }
    //
    //        if (OJ.is.stringNullOrEmpty(id) || false === (el instanceof HTMLElement) || false === OJ.is.vendorObject(_$el)) {
    //            OJ.errors.AssignmentError('Cannot instance an OJ Node without at least one handle on the DOM.')
    //        }
    //
    //        entity.id = id;
    //        entity[0] = el;
    //        entity['?'] = _$el;
    //        return entity;
    //    });
    //
    //    OJ.metadata.lift('NodeInstance', NodeInstance)


    /**
     * Node is the class representing an OJ DOM Node.
     * I'm using it less for inheritance chaining an more as a way to explicitly Type my instance data.
     * Returns an Object of type Node: call either by creating Object.create(new Nodee()) or
     * at some later point by someObj.prototype = new Node().
     */
    var Node = OJ.Class('Node', NodeAbstract, function (id, el, _$el) {
        'use strict';
        ///<summary>Instance an OJ Node prototype</summary>
        ///<param name="entity" type="Entity">An Entity object</param>
        ///<returns type="Node">Description</returns>
        var node = this;

        Object.defineProperty(node, 'vendorVal', {
            get: function () {
                var ret = null;
                if (node && node['?']) {
                    ret = node['?'].val.call(node)
                }
                return ret;
            },
            set: function (val) {
                var ret = null;
                if (node && node['?']) {
                    ret = node['?'].val.call(node, val);
                }
                return ret;
            }
        });
        Object.defineProperty(node, 'OjVal', {
            value: null,
            configurable: true,
            writable: true
        });

        Object.defineProperty(node, 'tagName', {
            get: function () {
                var ret = null;
                if (node && node['0']) {
                    ret = node[0].tagName;
                }
                return ret;
            }
        });

        Object.defineProperty(node, 'rootNode', {
            value: null,
            writable: true
        });

        Object.defineProperty(node, 'parentNode', {
            value: null,
            writable: true
        });

        Object.defineProperty(node, 'childNodes', {
            value: [],
            writable: true
        });

        Object.defineProperty(node, 'valueOf', {
            value: function () {
                return node;
            }
        });

        Object.defineProperty(node, 'value', {
            get: function () {
                var ret = null;
                if (null !== node.OjVal) {
                    ret = node.OjVal;
                }
                else {
                    ret = node.vendorVal()
                }
                return ret;
            },
            set: function (val) {
                var ret = val;
                if (null !== node.OjVal) {
                    node.OjVal = ret;
                }
                else {
                    node.vendorVal(ret)
                }
                return ret;
            }
        });

        return node;
    });

    OJ.metadata.lift('Node', Node);

}(OJ['?']));