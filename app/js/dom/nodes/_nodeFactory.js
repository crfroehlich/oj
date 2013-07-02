/*global n$:true*/
(function(n$){

    n$.makeSubNameSpace('elements');

    n$.node.register('factory',
        function(NsNode) {
            'use strict';

            if(!NsNode) { //|| !NsNode.isValid()) {
                throw new Error('Cannot make an OJ factory without an OJ Node!');
            }
            
            var NsInternal = {
                count: 0
            };

            var isChildNodeTypeAllowed = (function() {
                //This list is not yet exhaustive, just exclude the obvious
                var nonNestableNodes = ['li', 'legend', 'tr', 'td', 'option', 'body', 'head', 'source', 'tbody'];
                return function(tagName) {
                    var ret = false;
                    switch(NsNode.tagName.toLowerCase()) {
                        case 'body':
                            ret = (tagName === 'div' ||
                                    tagName === 'span' ||
                                    tagName === 'h1' ||
                                    tagName === 'h2' ||
                                    tagName === 'h3' ||
                                    tagName === 'h4' ||
                                    tagName === 'h5' ||
                                    tagName === 'h6' ||
                                    tagName === 'p' ||
                                    tagName === 'fieldset' ||
                                    tagName === 'select' ||
                                    tagName === 'ol' ||
                                    tagName === 'ul' ||
                                    tagName === 'table');
                            break;
                        case 'div':
                            ret = nonNestableNodes.indexOf(tagName) === -1;
                            break;
                        case 'form':
                            ret = nonNestableNodes.indexOf(tagName) === -1;
                            break;
                        case 'label':
                            ret = nonNestableNodes.indexOf(tagName) === -1;
                            break;
                        case 'legend':
                            ret = (NsNode.parent.tagName === 'fieldset');
                            break;
                        case 'fieldset':
                            ret = (tagName === 'legend' || nonNestableNodes.indexOf(tagName) === -1);
                            break;
                        case 'ol':
                            ret = tagName === 'li';
                            break;
                        case 'ul':
                            ret = tagName === 'li';
                            break;
                        case 'li':
                            ret = (NsNode.parent.tagName === 'ol' || NsNode.parent.tagName === 'ul') && nonNestableNodes.indexOf(tagName) === -1;
                            break;
                        case 'table':
                            ret = tagName === 'td' || tagName === 'tr' || tagName === 'tbody';
                            break;
                        case 'td':
                            ret = nonNestableNodes.indexOf(tagName) === -1;
                            break;
                    }
                    return ret;
                };
            }());

            var prepId = function(options, childTagName) {
                options = options || Object.create(null);
                NsInternal.count += 1;

                var id = NsNode.id;
                if(options.name) {
                    id += options.name;
                }
                id += NsNode.tagName + n$.to.string(childTagName) + NsInternal.count;

                Object.defineProperty(options, 'id', { value: id });
                return options;
            };

            if(isChildNodeTypeAllowed('a')){
                Object.defineProperty(NsNode, 'a', { value: function (opts) {
                    var childNode = n$.elements.a(NsNode, prepId(opts, 'a'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('b')){
                Object.defineProperty(NsNode, 'b', { value: function (opts) {
                    var childNode = n$.elements.b(NsNode, prepId(opts));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('br')){
                Object.defineProperty(NsNode, 'br', { value: function (opts) {
                    var childNode = n$.elements.br(NsNode, prepId(opts));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('button')){
                Object.defineProperty(NsNode, 'button', { value: function (opts) {
                    var childNode = n$.elements.button(NsNode, prepId(opts, 'button'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('div')){
                Object.defineProperty(NsNode, 'div', { value: function (opts) {
                    var childNode = n$.elements.div(NsNode, prepId(opts, 'div'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('fieldSet')){
                Object.defineProperty(NsNode, 'fieldSet', { value: function (opts) {
                    var childNode = n$.elements.fieldSet(NsNode, prepId(opts, 'fieldSet'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('form')){
                Object.defineProperty(NsNode, 'form', { value: function (opts) {
                    var childNode = n$.elements.form(NsNode, prepId(opts, 'form'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('img')){
                Object.defineProperty(NsNode, 'img', { value: function (opts) {
                    var childNode = n$.elements.img(NsNode, prepId(opts, 'img'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('input')){
                Object.defineProperty(NsNode, 'input', { value: function (opts) {
                    var childNode = n$.elements.input(NsNode, prepId(opts, 'input'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('label')){
                Object.defineProperty(NsNode, 'label', { value: function (opts) {
                    var childNode = n$.elements.label(NsNode, prepId(opts, 'label'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('li')){
                Object.defineProperty(NsNode, 'li', { value: function (opts) {
                    var childNode = n$.elements.li(NsNode, prepId(opts, 'li'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('ol')){
                Object.defineProperty(NsNode, 'ol', { value: function (opts) {
                    var childNode = n$.elements.ol(NsNode, prepId(opts, 'ol'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('option')){
                Object.defineProperty(NsNode, 'option', { value: function (opts) {
                    var childNode = n$.elements.option(NsNode, prepId(opts, 'option'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('p')){
                Object.defineProperty(NsNode, 'p', { value: function (opts) {
                    var childNode = n$.elements.p(NsNode, prepId(opts, 'p'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('select')){
                Object.defineProperty(NsNode, 'select', { value: function (opts) {
                    var childNode = n$.elements.select(NsNode, prepId(opts, 'select'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('span')){
                Object.defineProperty(NsNode, 'span', { value: function (opts) {
                    var childNode = n$.elements.span(NsNode, prepId(opts, 'span'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('table')){
                Object.defineProperty(NsNode, 'table', { value: function (opts) {
                    var childNode = n$.elements.table(NsNode, prepId(opts, 'table'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('textArea')){
                Object.defineProperty(NsNode, 'textArea', { value: function (opts) {
                    var childNode = n$.elements.textArea(NsNode, prepId(opts, 'textArea'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('ul')){
                Object.defineProperty(NsNode, 'ul', { value: function (opts) {
                    var childNode = n$.elements.ul(NsNode, prepId(opts, 'ul'));
                    return childNode;
                }});
            }

            return NsNode;
        });

}(window.$nameSpace$));