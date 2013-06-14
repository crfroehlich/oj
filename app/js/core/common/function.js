/*global n$:true*/
(function(n$){

    n$.register('tryExec', function(func) {
        'use strict';
        var ret = false;
        try {
            if (n$.is.func(func)) {
                ret = func.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        } catch(exception) {
            if ((exception.name !== 'TypeError' ||
                exception.type !== 'called_non_callable') &&
                exception.type !== 'non_object_property_load') { /* ignore errors failing to exec self-executing functions */
                n$.console.error(exception);
            }
        } finally {
            return ret;
        }
    });

    n$.register('method', function(func) {
        'use strict';
        var that = this;
        return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(func);
            return n$.tryExec.apply(that, args);
        };
    });

}(window.$nameSpace$));
