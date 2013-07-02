/*global n$:true*/
(function(n$) {

    n$.elements.register('span', function(NsNode, options) {

        var span = NsNode.addChild('<span id="' + options.id +  '" value="' + options.value + '">' + n$.to.string(options.display) + '</span>');
        span.data(options);
        span.addClass(options.cssclass);
        span.css(options.styles);
        span.attr(options.attr);
        span.prop(options.prop);

        return span;

    });


}(window.$nameSpace$));