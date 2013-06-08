/*global OJ:true*/
(function () {

    OJ.dependsOn(['OJ.metadata.Node'], function () {

        var Div = OJ.Class('Div', OJ.metadata.Node, function () {
            var div = this;

            div.nodeName = 'DIV';
            return div;
        });

        OJ.metadata.lift('Div', Div);

        OJ.elements.lift('div', function (OjNode, options) {

            var html = '<div id="' + options.id + '" value="' + options.value + '">' + OJ.to.string(options.display) + '</div>';
            var vendorHtml = OJ.to.vendorDomObjFromString(html);
            var div = new OJ.metadata.Div(options.id, vendorHtml[0], vendorHtml);
            OjNode.addChild(div);

            Object.defineProperty(div, 'OjVal', {
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
    });

}());