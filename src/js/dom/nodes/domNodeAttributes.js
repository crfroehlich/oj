/*global OJ:true*/
(function(n$) {

    var optionsProto = function() {
        //n$.property(obj, name, val, writable, configurable, enumerable);
        
        n$.property(this, 'accesskey', null, false, true);
        n$.property(this, 'class', null, false, true);
        n$.property(this, 'contenteditable', null, false, true);
        n$.property(this, 'contextmenu', null, false, true);
        n$.property(this, 'draggable', null, false, true);
        n$.property(this, 'dropzone', null, false, true);
        n$.property(this, 'hidden', null, false, true);
        n$.property(this, 'spellcheck', null, false, true);
        n$.property(this, 'style', null, false, true);
        n$.property(this, 'tabindex', null, false, true);
        n$.property(this, 'title', null, false, true);

        return this;
    };

    n$.node.register('globalAttributes', function(options) {
        var globOpts = n$.object(optionsProto.prototype);
        var ret = globOpts;
        if(n$.is.plainObject(options)) {
            n$.property(options, 'globalAttributes', globOpts);
            ret = options;
        }
        return ret;
    });


}(window.$nameSpace$, window.$nameSpace$['?']));