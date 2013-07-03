/*global n$:true */
(function(n$, _$) {

    /**
     * Create a temporary DOM node
     */
    n$.node.register('makeTemp', function(id, el, _$el) {
        'use strict';
        //return Object.create(new n$.metadata.Node());
        return new n$.metadata.Node(id, el, _$el);
    });

    /**
     * Cast a DOM node into a namespace Node
     */
    n$.node.register('make', function(id, el, _$el) {
        'use strict';
        var node = new n$.metadata.Node(id, el, _$el);
        return n$.node.extendNode(node);
    });

    /**
     * Extend a Node with helper methods and properties
     */
    n$.node.register('extendNode', function(NsNode) {
        'use strict';
        var NsInternal = n$.object();
        if (!isNode(NsNode)) {
            throw new TypeError('Cannot chain DOM methods without a Node.');
        }

        /*** Region DOM Extension Methods  */

        /**
         * These are _THE_ mechanisms for building out the DOM.
         * NS may later support *pend methods, but for now it's turtles all the way down.
         */
        NsNode.add('addChild', function addChild(newNode) {
            return NsInternal.buildChildNode(newNode);
        });

        /**
         * These are _THE_ mechanisms for building out the DOM.
         * NS may later support *pend methods, but for now it's turtles all the way down.
         */
        NsNode.add('makeChild', function makeChild(html) {
                if (n$.is.string(html)) {
                    return NsNode.append(html);
                }
            }
        );

        NsInternal.buildChildNode = function(node) {
            if (!isNode(node)) {
                throw new TypeError('Argument called with invalid node.');
            }

            if (NsNode.rootNode) {
                node.rootNode = NsNode.rootNode;
            }
            else if (NsNode.parentNode) {
                node.rootNode = NsNode.parentNode;
            }
            else {
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
        var el = n$.object();

        el.add('children', 
            function children(searchTerm, selector) {
                var ret = [];
                if (isNodeAlive(NsNode)) {
                    var _$children = NsNode['?'].children(n$.to.string(searchTerm), n$.to.string(selector));
                    if (_$children) {
                        _$children.each(function() {
                            var el = this;
                            var childNode = n$.nodes.make(el.id, el, _$(el));
                            ret.push(childNode);
                        });
                    }
                }
                return ret;
            }
        );

        el.add('filter', 
            function filter(selector) {
                var ret = [];
                if (selector && isNodeAlive(NsNode)) {
                    var _$children = NsNode['?'].filter(selector);
                    _$children.each(function() {
                        var el = this;
                        var childNode = n$.nodes.make(el.id, el, _$(el));
                        ret.push(childNode);
                    });
                }
                return ret;
            }
        );

        el.add('find', 
            function find(selector) {
                var ret = [];
                if (selector && isNodeAlive(NsNode)) {
                    var _$children = NsNode['?'].find(selector);
                    if (_$children.length > 0) {
                        _$children.each(function() {
                            var el = this;
                            var childNode = n$.nodes.make(el.id, el, _$(el));
                            ret.push(childNode);
                        });
                    }
                }
                return ret;
            }
        );

        el.add('first', function first() {
                var ret = NsNode.childNodes[0] || NsNode.el.children[0];
                return ret;
            }
        );

        el.add('parent', function parent() {
                var ret = {};
                if (isNodeAlive(NsNode)) {
                    var _$parent = NsNode['?'].parent();

                    if (false === n$.is.vendorObject(_$parent) && _$parent.length > 0) {
                        ret = n$.node.make(_$parent[0].id, _$parent[0], _$parent);
                    }
                }
                return ret;
            }
        );

        /*** End Region Vendor Selector Methods */

        /*** Region DOM Manipulation Methods */

        /**
         * NS implements these wrappers around jQuery methods to provide better chaining on NS Nodes,
         * as well as to make it easy to swap out the DOM framework without having to change the interfaces
         */
        NsNode.add('addClass', 
            function addClass(name) {
                if (name && isNodeAlive(NsNode)) {
                    NsNode['?'].addClass(name);
                }
                return NsNode;
            }
        );

        NsNode.add('append', function append(object) {
                var ret = NsNode;
                if (object && isNodeAlive(NsNode)) {
                    if (n$.is.vendorObject(object) || n$.is.string(object)) {
                        NsNode['?'].append(object);
                        //                        var tmpNode = n$.node.makeTemp(object[0].id, object[0], object);
                        //                        ret = NsInternal.buildChildNode(tmpNode, object);
                    }

                }
                return ret;
            }
        );

        NsNode.add('attr', function attr(name, value) {
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
        );

        NsNode.add('bind', function bind(eventName, event) {
                if (eventName && isNodeAlive(NsNode)) {
                    NsNode['?'].on(eventName, event);
                }
                return NsNode;
            }
        );
        NsNode.add('on', NsNode.bind);

        NsNode.add('clickOnEnter', 
            function clickOnEnter(anNsNode) {
                if (anNsNode && NsInternal.isNodeAlive()) {
                    NsNode['?'].clickOnEnter(anNsNode['?']);
                }
                return NsNode;
            }
        );

        NsNode.add('css', function css(param1, param2) {
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
        );

        NsNode.add('data', 
            function data(prop, val) {
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
        );

        NsNode.add('disable', 
            function disable() {
                if (isNodeAlive(NsNode)) {
                    NsInternal.enabled = false;
                    NsNode.addClass('NsDisabled');
                    NsNode.attr('disabled', 'disabled');
                }
                return NsNode;
            }
        );

        NsNode.add('empty', 
            function empty() {
                if (isNodeAlive(NsNode)) {
                    NsNode['?'].empty();
                    NsNode.childNodes = [];
                }
                return NsNode;
            }
        );

        NsNode.add('enable', 
            function enable() {
                if (isNodeAlive(NsNode)) {
                    NsInternal.enabled = true;
                    NsNode.removeClass('NsDisabled');
                    NsNode.removeAttr('disabled');
                }
                return NsNode;
            }
        );

        NsNode.add('hide', 
            function hide() {
                if (isNodeAlive(NsNode)) {
                    NsNode.addClass('NsHidden');
                    NsNode['?'].hide();
                }
                return NsNode;
            }
        );

        NsNode.add('prop', 
            function prop(name, value) {
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
        );

        NsNode.add('remove', 
            function remove() {
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
        );

        NsNode.add('removeClass', 
            function removeClass(name) {
                if (name && isNodeAlive(NsNode)) {
                    NsNode['?'].removeClass(name);
                }
                return NsNode;
            }
        );

        NsNode.add('removeProp', 
            function removeProp(name) {
                if (name && isNodeAlive(NsNode)) {
                    NsNode['?'].removeProp(name);
                }
                return NsNode;
            }
        );

        NsNode.add('removeAttr', 
            function removeAttr(name) {
                if (name && isNodeAlive(NsNode)) {
                    NsNode['?'].removeAttr(name);
                }
                return NsNode;
            }
        );

        NsNode.add('show', 
            function show() {
                if (isNodeAlive(NsNode)) {
                    NsNode.removeClass('NsHidden');
                    NsNode['?'].show();
                }
                return NsNode;
            }
        );

        NsNode.add('text', 
            function text(text) {
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
        );

        NsNode.add('toggle', 
            function toggle() {
                if (isNodeAlive(NsNode)) {
                    NsNode['?'].toggle();
                }
                return NsNode;
            }
        );

        NsNode.add('toggleEnable', 
            function toggleEnable() {
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
        );

        NsNode.add('trigger', 
            function trigger(eventName, eventOpts) {
                if (eventName && isNodeAlive(NsNode)) {
                    NsNode['?'].trigger(eventName, eventOpts);
                }
                return NsNode;
            }
        );

        NsNode.add('unbind', 
            function unbind(eventName, event) {
                if (eventName && isNodeAlive(NsNode)) {
                    NsNode['?'].off(eventName, event);
                }
                return NsNode;
            }
        );
        
        NsNode.add('off', NsNode.unbind);

        /*** Region DOM Manipulation Methods */

        //Finally! Return something.
        return n$.node.factory(NsNode);
    });

    /***
     * Private, internal methods
     */

    var isNode = function(nodeCandidate) {
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
    var isNodeAlive = function(NsNode) {
        return false === n$.is.nullOrEmpty(NsNode) && isNode(NsNode);
    };


    //Define some internal data methods
    var getDataProp = function(NsNode, dataObj, propName) {
        var ret = null;
        if (isNodeAlive(NsNode) && false === n$.is.stringNullOrEmpty(propName)) {

            if (NsNode[0] && NsNode[0].dataset && NsNode[0].dataset[propName]) {
                ret = NsNode[0].dataset.propName;
            }
            if (n$.is.stringNullOrEmpty(ret)) {
                ret = dataObj.data[propName] || NsNode['?'].data(propName) || n$.localStorage.getItem(propName + '_control_data_ ' + NsNode.getId());
            }
        }
        return ret;
    };


    var setDataProp = function(NsNode, dataObj, propName, value) {
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

    var setDataProperties = function(NsNode, dataObj, obj) {
        if (obj && Object.keys(obj)) {
            n$.each(function(key, val) {
                setDataProp(NsNode, dataObj, key, val);
            });
        }
    };



}(window.$nameSpace$, window.$nameSpace$['?']));
