/*global OJ:true */
(function (_$) {

    OJ.node.lift('makeTemp', function (id, el, _$el) {
        'use strict';
        //return Object.create(new OJ.metadata.Node());
        return new OJ.metadata.Node(id, el, _$el);
    });

    OJ.node.lift('make', function (id, el, _$el) {
        'use strict';
        var node = new OJ.metadata.Node(id, el, _$el);
        return OJ.node.extendNode(node);
    });

    OJ.node.lift('extendNode', function (OjNode) {
        'use strict';
        var OjInternal = Object.create(null);
        if (!isNode(OjNode)) {
            throw new TypeError('Cannot chain DOM methods without a Node.');
        }

        /*** Region DOM Extension Methods  */

        /**
         * These are _THE_ mechanisms for building out the DOM.
         * OJ may later support *pend methods, but for now it's turtles all the way down.
         */
        Object.defineProperty(OjNode, 'addChild', {
            value: function (newNode) {
                return OjInternal.buildChildNode(newNode);
            }
        });

        /**
         * These are _THE_ mechanisms for building out the DOM.
         * OJ may later support *pend methods, but for now it's turtles all the way down.
         */
        Object.defineProperty(OjNode, 'makeChild', {
            value: function (html) {
                if (OJ.is.string(html)) {
                    return OjNode.append(html);
                }
            }
        });

        OjInternal.buildChildNode = function (node) {
            if (!isNode(node)) {
                throw new TypeError('Argument called with invalid node.');
            }

            if (OjNode.rootNode) {
                node.rootNode = OjNode.rootNode;
            }
            else if (OjNode.parentNode) {
                node.rootNode = OjNode.parentNode;
            } else {
                node.rootNode = OjNode;
            }

            node.parentNode = OjNode;

            OjNode.append(node['?']);
            OjNode.childNodes.push(node);

            /**
             * To complete the loop, the newly appended node must be extended with the node.methods collectiom;
             * which, in turn, will extend the node it receives with the elements factory.
            */
            return OJ.node.extendNode(node);
        };

        /*** End Region DOM Extension Methods  */

        /*** Region Vendor Selector Methods */

        /**
         *  OJ doesn't need many vendor selectors,
         *  but when it does they are sequestered on this property to "try" to avoid confusion.
        */
        var el = Object.create(null);

        Object.defineProperty(el, 'children', {
            value: function (searchTerm, selector) {
                var ret = [];
                if (isNodeAlive(OjNode)) {
                    var _$children = OjNode['?'].children(OJ.to.string(searchTerm), OJ.to.string(selector));
                    if (_$children) {
                        _$children.each(function () {
                            var el = this;
                            var childNode = OJ.nodes.make(el.id, el, _$(el));
                            ret.push(childNode);
                        });
                    }
                }
                return ret;
            }
        });

        Object.defineProperty(el, 'filter', {
            value: function (selector) {
                var ret = [];
                if (selector && isNodeAlive(OjNode)) {
                    var _$children = OjNode['?'].filter(selector);
                    _$children.each(function () {
                            var el = this;
                            var childNode = OJ.nodes.make(el.id, el, _$(el));
                            ret.push(childNode);
                        });
                }
                return ret;
            }
        });

        Object.defineProperty(el, 'find', {
            value: function (selector) {
                var ret = [];
                if (selector && isNodeAlive(OjNode)) {
                    var _$children = OjNode['?'].find(selector);
                    if (_$children.length > 0) {
                        _$children.each(function () {
                            var el = this;
                            var childNode = OJ.nodes.make(el.id, el, _$(el));
                            ret.push(childNode);
                        });
                    }
                }
                return ret;
            }
        });

        Object.defineProperty(el, 'first', {
            value: function () {
                var ret = OjNode.childNodes[0] || OjNode.el.children[0];
                return ret;
            }
        });

        Object.defineProperty(el, 'parent', {
            value: function () {
                var ret = {};
                if (isNodeAlive(OjNode)) {
                    var _$parent = OjNode['?'].parent();

                    if (false === OJ.is.vendorObject(_$parent) && _$parent.length > 0) {
                        ret = OJ.node.make(_$parent[0].id, _$parent[0], _$parent);
                    }
                }
                return ret;
            }
        });

        /*** End Region Vendor Selector Methods */

        /*** Region DOM Manipulation Methods */

        /**
         * OJ implements these wrappers around jQuery methods to provide better chaining on OJ Nodes,
         * as well as to make it easy to swap out the DOM framework without having to change the interfaces
        */
        Object.defineProperty(OjNode, 'addClass', {
            value: function (name) {
                if (name && isNodeAlive(OjNode)) {
                    OjNode['?'].addClass(name);
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'append', {
            value: function (object) {
                var ret = OjNode;
                if (object && isNodeAlive(OjNode)) {
                    if(OJ.is.vendorObject(object) || OJ.is.string(object)) {
                        OjNode['?'].append(object);
//                        var tmpNode = OJ.node.makeTemp(object[0].id, object[0], object);
//                        ret = OjInternal.buildChildNode(tmpNode, object);
                    }

                }
                return ret;
            }
        });

        Object.defineProperty(OjNode, 'attr', {
            value: function (name, value) {
                var ret = null;
                if (name && isNodeAlive(OjNode)) {
                    ret = OjNode;

                    if (OJ.is.plainObject(name)) {
                        OjNode['?'].attr(name);
                    }
                    else if (arguments.length === 1) {
                        ret = OjNode['?'].attr(name);
                    }
                    else {
                        OjNode['?'].attr(name, value);
                    }
                }
                return ret;
            }
        });

//        Object.defineProperty(OjNode, 'attach', {
//            value: function (object) {
//                var _$child = null,
//                    ret;
//                if (object && isNodeAlive(OjNode)) {
//                    _$child = OJ.to.vendorDomObjFromString(object);
//                    if (false === OJ.is.nullOrEmpty(_$child)) {
//                        OjNode.append(_$child);
//                        ret = OjInternal.buildChildNode(null, _$child);
//                    }
//                }
//                return ret;
//            }
//        });

        Object.defineProperty(OjNode, 'bind', {
            value: function (eventName, event) {
                if (eventName && isNodeAlive(OjNode)) {
                    OjNode['?'].on(eventName, event);
                }
                return OjNode;
            }
        });
        Object.defineProperty(OjNode, 'on', {
            value: OJ.bind
        });

        Object.defineProperty(OjNode, 'clickOnEnter', {
            value: function (anOjNode) {
                if (anOjNode && OjInternal.isNodeAlive()) {
                    OjNode['?'].clickOnEnter(anOjNode['?']);
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'css', {
            value: function (param1, param2) {
                var ret = OjNode;
                if (param1 && OjInternal.isNodeAlive()) {
                    if (OJ.is.plainObject(param1)) {
                        OjNode['?'].css(param1);
                    }
                    else if (arguments.length === 1) {
                        ret = OjNode['?'].css(param1);
                    }
                    else {
                        OjNode['?'].css(param1, param2);
                    }
                }
                return ret;
            }
        });

        Object.defineProperty(OjNode, 'data', {
            value: function (prop, val) {
                var ret = '';
                if (prop && isNodeAlive(OjNode)) {
                    if (OJ.is.plainObject(prop)) {
                        setDataProperties(OjNode, OjInternal, prop);
                    }
                    else {
                        switch (arguments.length) {
                        case 1:
                            ret = getDataProp(OjNode, OjInternal, prop);
                            break;
                        case 2:
                            setDataProp(OjNode, OjInternal, prop, val);
                            ret = OjNode;
                            break;
                        }
                    }
                }
                return ret;

            }
        });

        Object.defineProperty(OjNode, 'disable', {
            value: function () {
                if (isNodeAlive(OjNode)) {
                    OjInternal.enabled = false;
                    OjNode.addClass('OjDisabled');
                    OjNode.attr('disabled', 'disabled');
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'empty', {
            value: function () {
                if (isNodeAlive(OjNode)) {
                    OjNode['?'].empty();
                    OjNode.childNodes = [];
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'enable', {
            value: function () {
                if (isNodeAlive(OjNode)) {
                    OjInternal.enabled = true;
                    OjNode.removeClass('OjDisabled');
                    OjNode.removeAttr('disabled');
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'hide', {
            value: function () {
                if (isNodeAlive(OjNode)) {
                    OjNode.addClass('OjHidden');
                    OjNode['?'].hide();
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'length', {
            value: function () {
                var ret = 0;
                if (isNodeAlive(OjNode)) {
                    ret = OJ.to.number(OjNode['?'].length);
                }
                return ret;
            }
        });

        Object.defineProperty(OjNode, 'prop', {
            value: function (name, value) {
                var ret = null;
                if (name && isNodeAlive(OjNode)) {
                    ret = OjNode;

                    if (OJ.is.plainObject(name)) {
                        OjNode['?'].prop(name);
                    }
                    else if (arguments.length === 1) {
                        ret = OjNode['?'].prop(name);
                    }
                    else {
                        OjNode['?'].prop(name, value);
                    }
                }
                return ret;
            }
        });

        Object.defineProperty(OjNode, 'remove', {
            value: function () {
                if (OjNode && OjNode['?']) {
                    OjNode['?'].remove();
                    OjNode.childNodes = [];
                    //This will update the internal reference to the node,
                    //which will allow isNodeAlive() to work as expected;
                    //however, it won't delete outstanding references to the Node.
                    //But that's OK. The GC will clean-up just fine.
                    OjNode = null;
                }
                return null;
            }
        });

        Object.defineProperty(OjNode, 'removeClass', {
            value: function (name) {
                if (name && isNodeAlive(OjNode)) {
                    OjNode['?'].removeClass(name);
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'removeProp', {
            value: function (name) {
                if (name && isNodeAlive(OjNode)) {
                    OjNode['?'].removeProp(name);
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'removeAttr', {
            value: function (name) {
                if (name && isNodeAlive(OjNode)) {
                    OjNode['?'].removeAttr(name);
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'show', {
            value: function () {
                if (isNodeAlive(OjNode)) {
                    OjNode.removeClass('OjHidden');
                    OjNode['?'].show();
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'text', {
            value: function (text) {
                if (text && isNodeAlive(OjNode)) {
                    if (arguments.length === 1 && false === OJ.is.nullOrUndefined(text)) {
                        OjNode['?'].text(text);
                        return OjNode;
                    }
                    else {
                        return OJ.to.string(OjNode['?'].text());
                    }
                }
            }
        });

        Object.defineProperty(OjNode, 'toggle', {
            value: function () {
                if (isNodeAlive(OjNode)) {
                    OjNode['?'].toggle();
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'toggleEnable', {
            value: function () {
                if (isNodeAlive(OjNode)) {
                    if (OjInternal.enabled) {
                        OjNode.disable();
                    }
                    else {
                        OjNode.enable();
                    }
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'trigger', {
            value: function (eventName, eventOpts) {
                if (eventName && isNodeAlive(OjNode)) {
                    OjNode['?'].trigger(eventName, eventOpts);
                }
                return OjNode;
            }
        });

        Object.defineProperty(OjNode, 'unbind', {
            value: function (eventName, event) {
                if (eventName && isNodeAlive(OjNode)) {
                    OjNode['?'].off(eventName, event);
                }
                return OjNode;
            }
        });
        Object.defineProperty(OjNode, 'off', {
            value: OjNode.unbind
        });

        /*** Region DOM Manipulation Methods */

        //Finally! Return something.
        return OJ.node.factory(OjNode);
    });

    /***
     * Private, internal methods
     */

    var isNode = function (nodeCandidate) {
        return nodeCandidate && OJ.is['instanceof'](OJ.metadata.Node, nodeCandidate);
    };

//    var addRootToNode = function (ojNode) {
//        'use strict';
//        var retNode = null;
//        if (isNode(ojNode) && !(isNode(ojNode.rootNode))) {
//
//            if (ojNode.tagName !== 'BODY') {
//                if (!ojNode.rootNode || !ojNode.rootNode[0]) {
//                    if (!ojNode.parentNode || !ojNode.parentNode[0]) {
//                        //Without valid OJ parents, the only logical root node is the body node
//                        retNode = OJ.node.make('body', document.getElementsByTagName('body')[0], OJ.to.vendorDomObject('body'));
//                    }
//                    else {
//                        var getRoot = function (parent) {
//                            if (isNode(parent) && isNode(parent.parentNode)) {
//
//                                retNode = parent.parentNode;
//                                if (isNode(retNode.parentNode) && retNode.parentNode.tagName.toLowerCase() !== 'body') {
//                                    retNode = getRoot(retNode);
//                                }
//                            }
//                            return retNode;
//                        };
//                        retNode = getRoot(ojNode);
//                    }
//                }
//            }
//            ojNode.rootNode = OJ.node.methods(retNode);
//        }
//    };
//
//    var addParentToNode = function (ojNode) {
//        'use strict';
//        if (isNode(ojNode) && ojNode.tagName !== 'body' && !(isNode(ojNode.parentNode))) {
//            if (ojNode[0].parentNode.tagName.toLowerCase() !== 'body') {
//                ojNode.parentNode = OJ.node.make(ojNode[0].parentNode.id, ojNode[0].parentNode);
//            }
//        }
//    };

    /**
     * Whether or no we have removed the node internally.
     * This doesn't actually test the DOM,
     * only our in-memory representation of the DOM.
     */
    var isNodeAlive = function (OjNode) {
        return false === OJ.is.nullOrEmpty(OjNode) && isNode(OjNode);
    };


    //Define some internal data methods
    var getDataProp = function (OjNode, dataObj, propName) {
        var ret = null;
        if (isNodeAlive(OjNode) && false === OJ.is.stringNullOrEmpty(propName)) {

            if (OjNode[0] && OjNode[0].dataset && OjNode[0].dataset[propName]) {
                ret = OjNode[0].dataset.propName;
            }
            if (OJ.is.stringNullOrEmpty(ret)) {
                ret = dataObj.data[propName] ||
                OjNode['?'].data(propName) ||
                OJ.localStorage.getItem(propName + '_control_data_ ' + OjNode.getId());
            }
        }
        return ret;
    };


    var setDataProp = function (OjNode, dataObj, propName, value) {
        var ret = null;
        if (isNodeAlive() && false === OJ.is.stringNullOrEmpty(propName)) {
            ret = value;
            if (OjNode[0] && OjNode[0].dataset) {
                OjNode[0].dataset[propName] = value;

                dataObj.data[propName] = value;
            }
            else {
                dataObj.data[propName] = value;
                OjNode['?'].data(propName, value);
            }
        }
        return ret;
    };

    var setDataProperties = function (OjNode, dataObj, obj) {
        if (obj && Object.keys(obj)) {
            Object.keys(obj).forEach(function (key, val) {
                setDataProp(OjNode, dataObj, key, val);
            });
        }
    };



}(OJ['?']));
