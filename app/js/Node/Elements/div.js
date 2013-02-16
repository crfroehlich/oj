/*global OJ:true*/
(function() {

	var Div = function(id, el, _$el) {
		var div = this;
        div.prototype = new OJ.metadata.Node(id, el, _$el);
		div.__proto__ = new OJ.metadata.Node(id, el, _$el);
		div.prototype.constructor = Div;

        div.nodeName = 'DIV';
		return div;
	};

    OJ.elements.lift('div', function(OjNode, options) {

        var html = '<div id="' + options.id +  '" value="' + options.value + '">' + OJ.to.string(options.display) + '</div>';
        var vendorHtml = OJ['?'](html);
        var div = new Div(options.id, null, vendorHtml);
        OjNode.addChild(div, html);

        div.OjVal = {
            get: function() {
                return options.value;
            },
            set: function(val) {
                options.value  = val;
                return val;
            }
        };


//        div.data(options);
//        div.addClass(options.cssclass);
//        div.css(options.styles);
//        div.attr(options.attr);
//        div.prop(options.prop);

        Object.defineProperty(div, 'val', { value: function() { return div[0].getAttribute('value'); } })

        return div;

    });


}());