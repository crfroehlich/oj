/*global OJ:true*/
(function() {

	var Div = function(obj) {
		this.nodeName = 'DIV';
		return this;
	};

    OJ.elements.lift('div', function(OjNode, options) {

        var div = new Div();
        var html = '<div id="' + options.id +  '" value="' + options.value + '">' + OJ.to.string(options.display) + '</div>';
        OjNode.addChild(div, html);
        div.data(options);
        div.addClass(options.cssclass);
        div.css(options.styles);
        div.attr(options.attr);
        div.prop(options.prop);

        Object.defineProperty(div, 'val', { value: function() { return div[0].getAttribute('value'); } })

        return div;

    });


}());