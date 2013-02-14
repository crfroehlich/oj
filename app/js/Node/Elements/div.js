/*global OJ:true*/
(function() {

	var Div = function() {
		this.nodeName = 'DIV';
		return this;
	};

    OJ.elements.lift('div', function(OjNode, options) {

        var div = new Div();
        var html = '<div id="' + options.id +  '" value="' + options.value + '">' + OJ.to.string(options.display) + '</div>';
        OjNode.addChild(div, html);

        Object.defineProperty(div, 'OjVal', {
            get: function() {
                return options.value;
            },
            set: function(val) {
                options.value  = val;
                return val;
            }
        });


//        div.data(options);
//        div.addClass(options.cssclass);
//        div.css(options.styles);
//        div.attr(options.attr);
//        div.prop(options.prop);

        return div;

    });


}());