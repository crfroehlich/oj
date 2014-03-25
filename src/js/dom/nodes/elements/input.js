/*global n$:true*/
(function(n$) {

    var Input = n$.Class('Input', n$.metadata.Node, function(NsNode, options) {
        var input = n$.elements._element(NsNode, 'input', options)
        return input;
    });

    n$.metadata.register('Input', Input);

    n$.elements.register('input', function(NsNode, options) {
        var input = n$.metadata.Input(NsNode, options);
        return input;
    });

}(window.$nameSpace$));