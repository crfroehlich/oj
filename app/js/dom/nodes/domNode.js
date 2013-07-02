/*global n$:true */
(function (n$, _$) {

    n$.node.register('makeTemp', function (id, el, _$el) {
        'use strict';
        //return Object.create(new n$.metadata.Node());
        return new n$.metadata.Node(id, el, _$el);
    });

    n$.node.register('make', function (id, el, _$el) {
        'use strict';
        var node = new n$.metadata.Node(id, el, _$el);
        return n$.node.extendNode(node);
    });

    n$.node.register('extendNode', function (NsNode) {
        'use strict';
        var NsInternal = Object.create(null);
        if (!isNode(NsNode)) {
            throw new TypeError('Cannot chain DOM methods without a Node.');
        }

        /*** Region DOM Extension Methods  */

        /**
         * These are _THE_ mechanisms for building out the DOM.
         * NS may later support *pend methods, but for now it's turtles all the way down.
         */
        Object.defineProperty(NsNode, 'addChild', {
            value: function (newNode) {
                return NsInternal.buildChildNode(newNode);
            }
        });

        /**
         * These are _THE_ mechanisms for building out the DOM.
         * NS may later support *pend methods, but for now it's turtles all the way down.
         */
        Object.defineProperty(NsNode, 'makeChild', {
            value: function (html) {
                if (n$.is.string(html)) {
                    return NsNode.append(html);
                }
            }
        });

        NsInternal.buildChildNode = function (node) {
            if (!isNode(node)) {
                throw new TypeError('Argument called with invalid node.');
            }

            if (NsNode.rootNode) {
                node.rootNode = NsNode.rootNode;
            }
            else if (NsNode.parentNode) {
                node.rootNode = NsNode.parentNode;
            } else {
                node.rootNode = NsNode;
            }

            node.parentNode = NsNode;

            NsNode.append(node['?']);
            NsNode.childNodes.push(node);

            /**
             * To complete the loop, the newly appended node must be extended with the node.methods collectiom;
             * which, in turn, will extend the node it receives with the elements factory.
            */
            return n$.node.extendNode(node);
        };

        /*** End Region DOM Extension Methods  */

        /*** Region Vendor Selector Methods */

        /**
         *  NS doesn't need many vendor selectors,
         *  but when it does they are sequestered on this property to "try" to avoid confusion.
        */
        var el = Object.create(null);

        Object.defineProperty(el, 'children', {
            value: function (searchTerm, selector) {
                var ret = [];
                if (isNodeAlive(NsNode)) {
                    var _$children = NsNode['?'].children(n$.to.string(searchTerm), n$.to.string(selector));
                    if (_$children) {
                        _$children.each(function () {
                            var el = this;
                            var childNode = n$.nodes.make(el.id, el, _$(el));
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
                if (selector && isNodeAlive(NsNode)) {
                    var _$children = NsNode['?'].filter(selector);
                    _$children.each(function () {
                            var el = this;
                            var childNode = n$.nodes.make(el.id, el, _$(el));
                            ret.push(childNode);
                        });
                }
                return ret;
            }
        });

        Object.defineProperty(el, 'find', {
            value: function (selector) {
                var ret = [];
                if (selector && isNodeAlive(NsNode)) {
                    var _$children = NsNode['?'].find(selector);
                    if (_$children.length > 0) {
                        _$children.each(function () {
                            var el = this;
                            var childNode = n$.nodes.make(el.id, el, _$(el));
                            ret.push(childNode);
                        });
                    }
                }
                return ret;
            }
        });

        Object.defineProperty(el, 'first', {
            value: function () {
                var ret = NsNode.childNodes[0] || NsNode.el.children[0];
                return ret;
            }
        });

        Object.defineProperty(el, 'parent', {
            value: function () {
                var ret = {};
                if (isNodeAlive(NsNode)) {
                    var _$parent = NsNode['?'].parent();

                    if (false === n$.is.vendorObject(_$parent) && _$parent.length > 0) {
                        ret = n$.node.make(_$parent[0].id, _$parent[0], _$parent);
                    }
                }
                return ret;
            }
        });

        /*** End Region Vendor Selector Methods */

        /*** Region DOM Manipulation Methods */

        /**
         * NS implements these wrappers around jQuery methods to provide better chaining on NS Nodes,
         * as well as to make it easy to swap out the DOM framework without having to change the interfaces
        */
        Object.defineProperty(NsNode, 'addClass', {
            value: function (name) {
                if (name && isNodeAlive(NsNode)) {
                    NsNode['?'].addClass(name);
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'append', {
            value: function (object) {
                var ret = NsNode;
                if (object && isNodeAlive(NsNode)) {
                    if(n$.is.vendorObject(object) || n$.is.string(object)) {
                        NsNode['?'].append(object);
//                        var tmpNode = n$.node.makeTemp(object[0].id, object[0], object);
//                        ret = NsInternal.buildChildNode(tmpNode, object);
                    }

                }
                return ret;
            }
        });

        Object.defineProperty(NsNode, 'attr', {
            value: function (name, value) {
                var ret = null;
                if (name && isNodeAlive(NsNode)) {
                    ret = NsNode;

                    if (n$.is.plainObject(name)) {
                        NsNode['?'].attr(name);
                    }
                    else if (arguments.length === 1) {
                        ret = NsNode['?'].attr(name);
                    }
                    else {
                        NsNode['?'].attr(name, value);
                    }
                }
                return ret;
            }
        });

//        Object.defineProperty(NsNode, 'attach', {
//            value: function (object) {
//                var _$child = null,
//                    ret;
//                if (object && isNodeAlive(NsNode)) {
//                    _$child = n$.to.vendorDomObjFromString(object);
//                    if (false === n$.is.nullOrEmpty(_$child)) {
//                        NsNode.append(_$child);
//                        ret = NsInternal.buildChildNode(null, _$child);
//                    }
//                }
//                return ret;
//            }
//        });

        Object.defineProperty(NsNode, 'bind', {
            value: function (eventName, event) {
                if (eventName && isNodeAlive(NsNode)) {
                    NsNode['?'].on(eventName, event);
                }
                return NsNode;
            }
        });
        Object.defineProperty(NsNode, 'on', {
            value: n$.bind
        });

        Object.defineProperty(NsNode, 'clickOnEnter', {
            value: function (anNsNode) {
                if (anNsNode && NsInternal.isNodeAlive()) {
                    NsNode['?'].clickOnEnter(anNsNode['?']);
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'css', {
            value: function (param1, param2) {
                var ret = NsNode;
                if (param1 && NsInternal.isNodeAlive()) {
                    if (n$.is.plainObject(param1)) {
                        NsNode['?'].css(param1);
                    }
                    else if (arguments.length === 1) {
                        ret = NsNode['?'].css(param1);
                    }
                    else {
                        NsNode['?'].css(param1, param2);
                    }
                }
                return ret;
            }
        });

        Object.defineProperty(NsNode, 'data', {
            value: function (prop, val) {
                var ret = '';
                if (prop && isNodeAlive(NsNode)) {
                    if (n$.is.plainObject(prop)) {
                        setDataProperties(NsNode, NsInternal, prop);
                    }
                    else {
                        switch (arguments.length) {
                        case 1:
                            ret = getDataProp(NsNode, NsInternal, prop);
                            break;
                        case 2:
                            setDataProp(NsNode, NsInternal, prop, val);
                            ret = NsNode;
                            break;
                        }
                    }
                }
                return ret;

            }
        });

        Object.defineProperty(NsNode, 'disable', {
            value: function () {
                if (isNodeAlive(NsNode)) {
                    NsInternal.enabled = false;
                    NsNode.addClass('NsDisabled');
                    NsNode.attr('disabled', 'disabled');
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'empty', {
            value: function () {
                if (isNodeAlive(NsNode)) {
                    NsNode['?'].empty();
                    NsNode.childNodes = [];
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'enable', {
            value: function () {
                if (isNodeAlive(NsNode)) {
                    NsInternal.enabled = true;
                    NsNode.removeClass('NsDisabled');
                    NsNode.removeAttr('disabled');
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'hide', {
            value: function () {
                if (isNodeAlive(NsNode)) {
                    NsNode.addClass('NsHidden');
                    NsNode['?'].hide();
                }
                return NsNode;
            }
        });

       /* Object.defineProperty(NsNode, 'length', {
            value: function () {
                var ret = 0;
                if (isNodeAlive(NsNode)) {
                    ret = n$.to.number(NsNode['?'].length);
                }
                return ret;
            }
        });*/

        Object.defineProperty(NsNode, 'prop', {
            value: function (name, value) {
                var ret = null;
                if (name && isNodeAlive(NsNode)) {
                    ret = NsNode;

                    if (n$.is.plainObject(name)) {
                        NsNode['?'].prop(name);
                    }
                    else if (arguments.length === 1) {
                        ret = NsNode['?'].prop(name);
                    }
                    else {
                        NsNode['?'].prop(name, value);
                    }
                }
                return ret;
            }
        });

        Object.defineProperty(NsNode, 'remove', {
            value: function () {
                if (NsNode && NsNode['?']) {
                    NsNode['?'].remove();
                    NsNode.childNodes = [];
                    //This will update the internal reference to the node,
                    //which will allow isNodeAlive() to work as expected;
                    //however, it won't delete outstanding references to the Node.
                    //But that's OK. The GC will clean-up just fine.
                    NsNode = null;
                }
                return null;
            }
        });

        Object.defineProperty(NsNode, 'removeClass', {
            value: function (name) {
                if (name && isNodeAlive(NsNode)) {
                    NsNode['?'].removeClass(name);
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'removeProp', {
            value: function (name) {
                if (name && isNodeAlive(NsNode)) {
                    NsNode['?'].removeProp(name);
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'removeAttr', {
            value: function (name) {
                if (name && isNodeAlive(NsNode)) {
                    NsNode['?'].removeAttr(name);
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'show', {
            value: function () {
                if (isNodeAlive(NsNode)) {
                    NsNode.removeClass('NsHidden');
                    NsNode['?'].show();
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'text', {
            value: function (text) {
                if (text && isNodeAlive(NsNode)) {
                    if (arguments.length === 1 && false === n$.is.nullOrUndefined(text)) {
                        NsNode['?'].text(text);
                        return NsNode;
                    }
                    else {
                        return n$.to.string(NsNode['?'].text());
                    }
                }
            }
        });

        Object.defineProperty(NsNode, 'toggle', {
            value: function () {
                if (isNodeAlive(NsNode)) {
                    NsNode['?'].toggle();
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'toggleEnable', {
            value: function () {
                if (isNodeAlive(NsNode)) {
                    if (NsInternal.enabled) {
                        NsNode.disable();
                    }
                    else {
                        NsNode.enable();
                    }
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'trigger', {
            value: function (eventName, eventOpts) {
                if (eventName && isNodeAlive(NsNode)) {
                    NsNode['?'].trigger(eventName, eventOpts);
                }
                return NsNode;
            }
        });

        Object.defineProperty(NsNode, 'unbind', {
            value: function (eventName, event) {
                if (eventName && isNodeAlive(NsNode)) {
                    NsNode['?'].off(eventName, event);
                }
                return NsNode;
            }
        });
        Object.defineProperty(NsNode, 'off', {
            value: NsNode.unbind
        });

        /*** Region DOM Manipulation Methods */

        //Finally! Return something.
        return n$.node.factory(NsNode);
    });

    /***
     * Private, internal methods
     */

    var isNode = function (nodeCandidate) {
        return nodeCandidate && n$.is['instanceof'](n$.metadata.Node, nodeCandidate);
    };

//    var addRootToNode = function (NsNode) {
//        'use strict';
//        var retNode = null;
//        if (isNode(NsNode) && !(isNode(NsNode.rootNode))) {
//
//            if (NsNode.tagName !== 'BODY') {
//                if (!NsNode.rootNode || !NsNode.rootNode[0]) {
//                    if (!NsNode.parentNode || !NsNode.parentNode[0]) {
//                        //Without valid NS parents, the only logical root node is the body node
//                        retNode = n$.node.make('body', document.getElementsByTagName('body')[0], n$.to.vendorDomObject('body'));
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
//                        retNode = getRoot(NsNode);
//                    }
//                }
//            }
//            NsNode.rootNode = n$.node.methods(retNode);
//        }
//    };
//
//    var addParentToNode = function (NsNode) {
//        'use strict';
//        if (isNode(NsNode) && NsNode.tagName !== 'body' && !(isNode(NsNode.parentNode))) {
//            if (NsNode[0].parentNode.tagName.toLowerCase() !== 'body') {
//                NsNode.parentNode = n$.node.make(NsNode[0].parentNode.id, NsNode[0].parentNode);
//            }
//        }
//    };

    /**
     * Whether or no we have removed the node internally.
     * This doesn't actually test the DOM,
     * only our in-memory representation of the DOM.
     */
    var isNodeAlive = function (NsNode) {
        return false === n$.is.nullOrEmpty(NsNode) && isNode(NsNode);
    };


    //Define some internal data methods
    var getDataProp = function (NsNode, dataObj, propName) {
        var ret = null;
        if (isNodeAlive(NsNode) && false === n$.is.stringNullOrEmpty(propName)) {

            if (NsNode[0] && NsNode[0].dataset && NsNode[0].dataset[propName]) {
                ret = NsNode[0].dataset.propName;
            }
            if (n$.is.stringNullOrEmpty(ret)) {
                ret = dataObj.data[propName] ||
                NsNode['?'].data(propName) ||
                n$.localStorage.getItem(propName + '_control_data_ ' + NsNode.getId());
            }
        }
        return ret;
    };


    var setDataProp = function (NsNode, dataObj, propName, value) {
        var ret = null;
        if (isNodeAlive() && false === n$.is.stringNullOrEmpty(propName)) {
            ret = value;
            if (NsNode[0] && NsNode[0].dataset) {
                NsNode[0].dataset[propName] = value;

                dataObj.data[propName] = value;
            }
            else {
                dataObj.data[propName] = value;
                NsNode['?'].data(propName, value);
            }
        }
        return ret;
    };

    var setDataProperties = function (NsNode, dataObj, obj) {
        if (obj && Object.keys(obj)) {
            n$.each(function (key, val) {
                setDataProp(NsNode, dataObj, key, val);
            });
        }
    };



}(window.$nameSpace$, window.$nameSpace$['?']));
