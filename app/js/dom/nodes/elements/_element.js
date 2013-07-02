/*global n$:true*/
(function(n$) {

    var _Element = n$.Class('_Element', n$.metadata.Node, function(elementName) {
        var element = this;

        element.nodeName = elementName.toUpperCase();
        
        return element;
    });

    n$.metadata.register('_Element', _Element);

    n$.elements.register('_element', function(NsNode, elementName, options) {

        var html = '<' + elementName + ' id="' + options.id + '" value="' + options.value + '">' + options.display || options.value;
        if(elementName !== 'input') {
            html += '</' + elementName + '>' ;
        } else {
            html += '/>';
        }
        var vendorHtml = n$.to.vendorDomObjFromString(html);
        var element = new n$.metadata._Element(options.id, vendorHtml[0], vendorHtml);
        NsNode.addChild(element);

        Object.defineProperty(element, 'nsVal', {
            get: function() {
                return options.value;
            },
            set: function(val) {
                options.value = val;
                return val;
            }
        });


        element.data(options);
        element.addClass(options.cssclass);
        element.css(options.styles);
        element.attr(options.attr);
        element.prop(options.prop);

        Object.defineProperty(element, 'val', {
            value: function() {
                return element[0].getAttribute('value');
            }
        });

        return element;

    });


}(window.$nameSpace$));