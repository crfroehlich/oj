/*global n$:true*/
(function(n$) {

    var Div = n$.Class('Div', n$.metadata.Node, function(parentNode, options) {
        var div = n$.elements._element(parentNode, 'div', options)

        return div;
    });

    n$.metadata.register('Div', Div);

    n$.elements.register('div', function(parentNode, options) {

        var div = new Div(parentNode, options);
        return div;

    });


}(window.$nameSpace$));