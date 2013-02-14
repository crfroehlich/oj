/*global OJ:true*/
(function(){

    OJ.makeSubNameSpace('elements');

    OJ.node.lift('factory',
        function(OjNode) {
            'use strict';

            if(!OjNode && OjNode.isValid()) {
                throw new Error('Cannot make an OJ factory without an OJ Node!');
            }
            
            var OjInternal = {
                count: 0
            };

            var isChildNodeTypeAllowed = (function() {
                //This list is not yet exhaustive, just exclude the obvious
                var nonNestableNodes = ['li', 'legend', 'tr', 'td', 'option', 'body', 'head', 'source', 'tbody'];
                return function(tagName) {
                    var ret = false;
                    switch(OjNode.tagName.toLowerCase()) {
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
                            ret = (OjNode.parent.tagName === 'fieldset');
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
                            ret = (OjNode.parent.tagName === 'ol' || OjNode.parent.tagName === 'ul') && nonNestableNodes.indexOf(tagName) === -1;
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
                OjInternal.count += 1;

                var id = OjNode.getId();
                if(options.name) {
                    id += options.name;
                }
                id += OjNode.tagName + OJ.to.string(childTagName) + OjInternal.count;

                Object.defineProperty(options, 'id', { value: id });
                return options;
            };

            if(isChildNodeTypeAllowed('a')){
                Object.defineProperty(OjNode, 'a', { value: function (opts) {
                    var childNode = OJ.elements.a(OjNode, prepId(opts, 'a'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('b')){
                Object.defineProperty(OjNode, 'b', { value: function (opts) {
                    var childNode = OJ.elements.b(OjNode, prepId(opts));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('br')){
                Object.defineProperty(OjNode, 'br', { value: function (opts) {
                    var childNode = OJ.elements.br(OjNode, prepId(opts));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('button')){
                Object.defineProperty(OjNode, 'button', { value: function (opts) {
                    var childNode = OJ.elements.button(OjNode, prepId(opts, 'button'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('div')){
                Object.defineProperty(OjNode, 'div', { value: function (opts) {
                    var childNode = OJ.elements.div(OjNode, prepId(opts, 'div'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('fieldSet')){
                Object.defineProperty(OjNode, 'fieldSet', { value: function (opts) {
                    var childNode = OJ.elements.fieldSet(OjNode, prepId(opts, 'fieldSet'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('form')){
                Object.defineProperty(OjNode, 'form', { value: function (opts) {
                    var childNode = OJ.elements.form(OjNode, prepId(opts, 'form'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('img')){
                Object.defineProperty(OjNode, 'img', { value: function (opts) {
                    var childNode = OJ.elements.img(OjNode, prepId(opts, 'img'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('input')){
                Object.defineProperty(OjNode, 'input', { value: function (opts) {
                    var childNode = OJ.elements.input(OjNode, prepId(opts, 'input'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('label')){
                Object.defineProperty(OjNode, 'label', { value: function (opts) {
                    var childNode = OJ.elements.label(OjNode, prepId(opts, 'label'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('li')){
                Object.defineProperty(OjNode, 'li', { value: function (opts) {
                    var childNode = OJ.elements.li(OjNode, prepId(opts, 'li'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('ol')){
                Object.defineProperty(OjNode, 'ol', { value: function (opts) {
                    var childNode = OJ.elements.ol(OjNode, prepId(opts, 'ol'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('option')){
                Object.defineProperty(OjNode, 'option', { value: function (opts) {
                    var childNode = OJ.elements.option(OjNode, prepId(opts, 'option'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('p')){
                Object.defineProperty(OjNode, 'p', { value: function (opts) {
                    var childNode = OJ.elements.p(OjNode, prepId(opts, 'p'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('select')){
                Object.defineProperty(OjNode, 'select', { value: function (opts) {
                    var childNode = OJ.elements.select(OjNode, prepId(opts, 'select'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('span')){
                Object.defineProperty(OjNode, 'span', { value: function (opts) {
                    var childNode = OJ.elements.span(OjNode, prepId(opts, 'span'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('table')){
                Object.defineProperty(OjNode, 'table', { value: function (opts) {
                    var childNode = OJ.elements.table(OjNode, prepId(opts, 'table'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('textArea')){
                Object.defineProperty(OjNode, 'textArea', { value: function (opts) {
                    var childNode = OJ.elements.textArea(OjNode, prepId(opts, 'textArea'));
                    return childNode;
                }});
            }

            if(isChildNodeTypeAllowed('ul')){
                Object.defineProperty(OjNode, 'ul', { value: function (opts) {
                    var childNode = OJ.elements.ul(OjNode, prepId(opts, 'ul'));
                    return childNode;
                }});
            }

            return OjNode;
        });

}());