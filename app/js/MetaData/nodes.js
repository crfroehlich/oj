/*global OJ:true */
(function () {

    /***
     * The unsanitized base class for the representation of a DOM element at the highest level.
     */
    var NodeAbstract = function (id, el, _$el) {
        'use strict';
        ///<summary>An abstract representation of a Node that defers validation until assignment.</summary>
        ///<returns type="EntityAbstract">An EntityAbstract</returns>
        var internalEntity = {
            id: '',
            el: null,
            _$el: null
        };

        var entity = this;

        Object.defineProperty(entity, 'id', {
            set: function (val) {
                if (false === OJ.is.string(val)) {
                    throw new TypeError('DOM Element Identifiers must be Strings');
                }
                if (internalEntity.id.length > 0) {
                    OJ.errors.AssignmentError('DOM Element Identifiers cannot be changed once assigned.');
                }

                internalEntity.id = val;

                if (null === entity[0] && null !== document.getElementById(val)) {

                    entity[0] = document.getElementById(val);
                }

                if (null === entity['?'] && OJ.to.vendorDomObject(val)) {

                    entity['?'] = OJ.to.vendorDomObject(val);
                }
            },
            get: function () {
                return internalEntity.id;
            }
        });

        Object.defineProperty(entity, '0', {
            set: function (val) {
                if (val) {
                    if (false === val instanceof HTMLElement) {
                        throw new TypeError('Invalid assignment. Element must be of type HTMLElement.');
                    }
                    internalEntity.el = val;
                    if (OJ.is.stringNullOrEmpty(entity.id)) {
                        entity.id = val.id;
                    }
                    if (null === entity['?']) {
                        entity['?'] = OJ.to.vendorDomObject(entity.id);
                    }
                }
            },
            get: function () {
                return internalEntity.el;
            }
        });

        Object.defineProperty(entity, '?', {
            set: function (val) {
                if (val) {
                    if (false === OJ.is.vendorObject(val)) {
                        throw new TypeError('Invalid assignment. Vendor element must match the current vendor framework.');
                    }
                    internalEntity._$el = val;
                    if (OJ.is.stringNullOrEmpty(entity.id)) {
                        entity.id = internalEntity._$el[0].id;
                    }
                    if (null === entity[0]) {
                        entity[0] = internalEntity._$el[0];
                    }
                }
            },
            get: function () {
                return internalEntity._$el;
            }
        });
        if (id) {
            entity.id = id;
        }
        if (el) {
            entity[0] = el;
        }
        if (_$el) {
            entity['?'] = _$el;
        }

        return entity;
    };

    OJ.metadata.lift('NodeAbstract', NodeAbstract);

    /**
     * Node is the class representing an OJ DOM Node.
     * I'm using it less for inheritance chaining an more as a way to explicitly Type my instance data.
     * Returns an Object of type Node: call either by creating Object.create(new Nodee()) or
     * at some later point by someObj.prototype = new Node().
     */
    var Node = OJ.Class('Node', NodeAbstract, function () {
        'use strict';
        ///<summary>Instance an OJ Node prototype</summary>
        ///<param name="entity" type="Entity">An Entity object</param>
        ///<returns type="Node">Description</returns>
        var node = this;

        Object.defineProperty(node, 'vendorVal', {
            get: function () {
                var ret = null;
                if (node && node['?']) {
                    ret = node['?'].val.call(node);
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
                    ret = node.vendorVal();
                }
                return ret;
            },
            set: function (val) {
                var ret = val;
                if (null !== node.OjVal) {
                    node.OjVal = ret;
                }
                else {
                    node.vendorVal(ret);
                }
                return ret;
            }
        });

        return node;
    });

    OJ.metadata.lift('Node', Node);

    

}(OJ['?']));