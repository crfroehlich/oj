/*global n$:true*/
(function (n$) {

    var Div = n$.Class('Div', n$.metadata.Node, function () {
        var div = this;

        div.nodeName = 'DIV';
        return div;
    });

    n$.metadata.register('Div', Div);

    n$.elements.register('div', function (NsNode, options) {

        var html = '<div id="' + options.id + '" value="' + options.value + '">' + n$.to.string(options.display) + '</div>';
        var vendorHtml = n$.to.vendorDomObjFromString(html);
        var div = new n$.metadata.Div(options.id, vendorHtml[0], vendorHtml);
        NsNode.addChild(div);

        Object.defineProperty(div, 'nsVal', {
            get: function () {
                return options.value;
            },
            set: function (val) {
                options.value = val;
                return val;
            }
        });


        //        div.data(options);
        //        div.addClass(options.cssclass);
        //        div.css(options.styles);
        //        div.attr(options.attr);
        //        div.prop(options.prop);

        Object.defineProperty(div, 'val', {
            value: function () {
                return div[0].getAttribute('value');
            }
        });

        return div;

    });
    

}(window.$nameSpace$));