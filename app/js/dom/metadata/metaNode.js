/*global n$:true */
(function(n$, $) {

    /***
     * The unsanitized base class for the representation of a DOM element at the highest level.
     */
    var NodeAbstract = function(id, el, _$el) {
        'use strict';
        ///<summary>An abstract representation of a Node that defers validation until assignment.</summary>
        ///<returns type="EntityAbstract">An EntityAbstract</returns>
        var internalEntity = {
            id: id
        };

        var entity = this;

        Object.defineProperty(entity, 'id', {
            set: function(val) {
                if (false === n$.is.string(val)) {
                    throw new TypeError('DOM Element Identifiers must be Strings');
                }
                if (internalEntity.id.length > 0) {
                    n$.errors.AssignmentError('DOM Element Identifiers cannot be changed once assigned.');
                }
                internalEntity.id = val;
            },
            get: function() {
                return internalEntity.id;
            }
        });

        Object.defineProperty(entity, '0', {
            set: function(val) {
                if (internalEntity.id.length > 0) {
                    n$.errors.AssignmentError('DOM Element Identifiers cannot be changed once assigned.');
                }
                if (false === val instanceof HTMLElement) {
                    throw new TypeError('Invalid assignment. Element must be of type HTMLElement.');
                } else {
                    internalEntity.id = val.id;
                }
            },
            get: function() {
                var ret = el;
                if (!ret && internalEntity.id) {
                    ret = document.getElementById(internalEntity.id);
                    //Kludge, but body usually doesn't have an id. At least you're guaranteed to have only one of them per page.
                    if(!ret && internalEntity.id === 'body') {
                        ret = document.getElementsByTagName('body')[0];
                    }
                    if (ret && false === ret instanceof HTMLElement) {
                        throw new TypeError('Invalid assignment. Element must be of type HTMLElement.');
                    }
                }
                return ret;
            }
        });

        Object.defineProperty(entity, '?', {
            set: function(val) {
                if (false === n$.is.vendorObject(el)) {
                    throw new TypeError('Invalid assignment. Vendor element must match the current vendor framework.');
                } else {
                    internalEntity.id = val.id;
                }
            },
            get: function() {
                var ret = _$el;
                if (!ret && internalEntity.id) {
                    ret = n$.to.vendorDomObject(internalEntity.id)
                    if (false === n$.is.vendorObject(ret)) {
                        throw new TypeError('Invalid assignment. Vendor element must match the current vendor framework.');
                    }
                }
                return ret;
            }
        });
        
        Object.defineProperty(entity, 'length', {
            set: function(val) {
                throw new Error('Invalid assignment. Length is a readonly property.');
            },
            get: function() {
                var len = -1;
                if (internalEntity.id) {
                    el = n$.to.vendorDomObject(internalEntity.id)
                    if (false === n$.is.vendorObject(el)) {
                        throw new TypeError('Invalid assignment. Vendor element must match the current vendor framework.');
                    }
                    len = el.length;
                }
                return len;
            }
        });
        
        if (id) {
            entity.id = id;
        }
        else if (el && el.id) {
            entity.id = el.id;
        }
        else if (_$el && _$el.id) {
            entity.id = _$el.id;
        }

        return entity;
    };

    n$.metadata.register('NodeAbstract', NodeAbstract);

    /**
     * Node is the class representing an OJ DOM Node.
     * I'm using it less for inheritance chaining an more as a way to explicitly Type my instance data.
     * Returns an Object of type Node: call either by creating Object.create(new Nodee()) or
     * at some later point by someObj.prototype = new Node().
     */
    var Node = n$.Class('Node', NodeAbstract, function() {
        'use strict';
        ///<summary>Instance an OJ Node prototype</summary>
        ///<param name="entity" type="Entity">An Entity object</param>
        ///<returns type="Node">Description</returns>
        var node = this;

        Object.defineProperty(node, 'vendorVal', {
            get: function() {
                var ret = null;
                if (node && node['?']) {
                    ret = node['?'].val.call(node);
                }
                return ret;
            },
            set: function(val) {
                var ret = null;
                if (node && node['?']) {
                    ret = node['?'].val.call(node, val);
                }
                return ret;
            }
        });
        
        Object.defineProperty(node, 'Val', {
            value: null,
            configurable: true,
            writable: true
        });

        Object.defineProperty(node, 'tagName', {
            get: function() {
                var ret = 'Unknown Tag Name';
                if (node && node['0']) {
                    ret = node[0].tagName;
                }
                return ret;
            },
            set: function(val) {
                throw new Error('Assignment error. Node tag name is readonly.')
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
            value: function() {
                return node;
            }
        });

        Object.defineProperty(node, 'value', {
            get: function() {
                var ret = null;
                if (null !== node.val) {
                    ret = node.val;
                }
                else {
                    ret = node.vendorVal();
                }
                return ret;
            },
            set: function(val) {
                var ret = val;
                if (null !== node.val) {
                    node.val = ret;
                }
                else {
                    node.vendorVal(ret);
                }
                return ret;
            }
        });

        return node;
    });

    n$.metadata.register('Node', Node);



}(window.$nameSpace$, OJ['?']));