/*global n$:true,window:true*/
(function (n$) {
    'use strict';

    var onError = window.onerror;
    /**
     * Log errors to the console
    */
    window.onerror = function (msg, url, lineNumber) {

        console.warn('%s\rurl: %s\rline: %d', msg, url, lineNumber);
        if (onError) {
            onError(arguments);
        }
        return false; //true means don't propogate the error
    };

    if (!window.setImmediate) {
        /**
         * Shim for setImmediate
        */
        window.setImmediate = function (func, args) {
            return window.setTimeout(func, 0, args);
        };
        window.clearImmediate = window.clearTimeout;
    }

    if (!Function.prototype.inheritsFrom) {
        Object.defineProperties(Function.prototype, {
            inheritsFrom: {
                value:
                    /**
                     * Easy inheritance by prototype
                    */
                    function inheritsFrom(parentClassOrObject) {
                        if (parentClassOrObject.constructor === Function) {
                            //Normal Inheritance
                            this.prototype = new parentClassOrObject;
                            this.prototype.constructor = this;
                            this.prototype.parent = parentClassOrObject.prototype;
                        } else {
                            //Pure Virtual Inheritance
                            this.prototype = parentClassOrObject;
                            this.prototype.constructor = this;
                            this.prototype.parent = parentClassOrObject;
                        }
                        return this;
                    }
            }
        });
    }

}(window.$nameSpace$));
