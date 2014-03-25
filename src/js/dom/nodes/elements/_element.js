/*global n$:true*/
(function(n$) {

    /**
     * Elements base class. This will instance a new node from metadata, returning an object that can be consumed 
    */
    var _Element = n$.Class('_Element', n$.metadata.Node, function(elementName) {
        var element = this;

        element.nodeName = elementName.toUpperCase();
        
        return element;
    });

    n$.metadata.register('_Element', _Element);

    n$.elements.register('_element', function(parentNode, elementName, options) {

        var val = (options.display || options.value || '');
        var html = '<' + elementName + ' id="' + options.id + '" value="' + val + '"';
        
        if(elementName !== 'input') {
            html +=  '">' + val + '</' + elementName + '>' ;
        } else {
            html += '/>';
        }
        var vendorHtml = n$.to.vendorDomObjFromString(html);
        var element = new _Element(options.id, vendorHtml[0], vendorHtml);
        
        //Insert the new element into the DOM, directly upon the parent node from which it was called
        parentNode.addChild(element);
        
        //element.data(options);
        element.addClass(options.cssclass);
        element.css(options.styles);
        element.attr(options.attr);
        element.prop(options.prop);

        element.on('change', function() {  });

        Object.defineProperty(element, 'nsVal', {
            get: function() {
                return options.value;
            },
            set: function(val) {
                options.value = val;
                return val;
            }
        });

        Object.defineProperty(element, 'val', {
            value: function() {
                return element[0].getAttribute('value');
            }
        });

        

        return element;
    });

}(window.$nameSpace$));