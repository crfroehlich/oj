/*global OJ:true*/
(function() {

    var optionsProto = (function() {
        var ret = Object.create(null);

        Object.defineProperty(ret, 'accesskey', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'class', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'contenteditable', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'contextmenu', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'draggable', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'dropzone', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'hidden', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'spellcheck', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'style', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'tabindex', {
            value: '',
            writable: true
        });

        Object.defineProperty(ret, 'title', {
            value: '',
            writable: true
        });

        return ret;
    }());

    OJ.node.lift('globalAttributes', function(options) {
        var globOpts = Object.create(optionsProto);
        var ret = globOpts;
        if(OJ.is.plainObject(options)) {
            Object.defineProperty(options, 'globalAttributes', {value: globOpts });
            ret = options;
        }
        return ret;
    });


}());