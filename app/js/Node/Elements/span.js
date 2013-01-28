/*global OJ:true,$:true*/
(function() {

    OJ.elements.lift('span', function(OjNode, options) {

        var div = OjNode.addChild($('<span id="' + options.id +  '" value="' + options.value + '">' + OJ.to.string(options.display) + '</span>'));
        div.data(options);
        div.addClass(options.cssclass);
        div.css(options.styles);
        div.attr(options.attr);
        div.prop(options.prop);

        return div;

    });


}());