/*global OJ:true,$:true*/
(function() {

    OJ.elements.lift('div', function(OjNode, options) {

        var div = OjNode.addChild($('<div id="' + options.id +  '" value="' + options.value + '">' + OJ.to.string(options.display) + '</div>'));
        div.data(options);
        div.addClass(options.cssclass);
        div.css(options.styles);
        div.attr(options.attr);
        div.prop(options.prop);

        return div;

    });


}());