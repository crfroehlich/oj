/*global OJ:true*/
(function() {

    var optionsProto = function() {
        Object.defineProperty(this, 'accesskey', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'class', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'contenteditable', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'contextmenu', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'draggable', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'dropzone', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'hidden', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'spellcheck', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'style', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'tabindex', {
            value: null,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(this, 'title', {
            value: null,
            enumerable: true,
            writable: true
        });

        return this;
    };

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