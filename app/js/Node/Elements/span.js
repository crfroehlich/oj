/*global OJ:true*/
(function() {

    OJ.elements.lift('span', function(OjNode, options) {

        var span = OjNode.addChild('<span id="' + options.id +  '" value="' + options.value + '">' + OJ.to.string(options.display) + '</span>');
        span.data(options);
        span.addClass(options.cssclass);
        span.css(options.styles);
        span.attr(options.attr);
        span.prop(options.prop);

        return span;

    });


}());