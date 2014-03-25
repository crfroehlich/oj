/*global n$:true*/
(function(n$) {

    var Span = n$.Class('Span', n$.metadata.Node, function () {
        var span = this;

        span.nodeName = 'SPAN';
        return span;
    });

    n$.metadata.register('Span', Span);

    n$.elements.register('span', function (NsNode, options) {

        var html = '<span id="' + options.id + '" value="' + options.value + '">' + options.display || options.value + '</span>';
        var vendorHtml = n$.to.vendorDomObjFromString(html);
        var span = new n$.metadata.Span(options.id, vendorHtml[0], vendorHtml);
        NsNode.addChild(span);

        span.addClass(options.cssclass);
        span.css(options.styles);
        span.attr(options.attr);
        span.prop(options.prop);

        Object.defineProperty(span, 'nsVal', {
            get: function () {
                return options.value;
            },
            set: function (val) {
                options.value = val;
                return val;
            }
        });

        Object.defineProperty(span, 'val', {
            value: function () {
                return span[0].getAttribute('value');
            }
        });

        return span;

    });

}(window.$nameSpace$));