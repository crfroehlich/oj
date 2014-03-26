/*global n$:true*/
(function(n$) {

    var OJ = n$;

    /*
     * Wrap the execution of a method in a try..catch..finally 
    */
    OJ.register('tryExec', function tryExec(tryFunc) {
        'use strict';
        var ret = false;
        var that = this;
        try {
            if (OJ.is.func(tryFunc)) {
                ret = tryFunc.apply(that, Array.prototype.slice.call(arguments, 1));
            }
        } catch(exception) {
            if ((exception.name === 'TypeError' ||
                exception.type === 'called_non_callable') &&
                exception.type === 'non_object_property_load') { /* ignore errors failing to exec self-executing functions */
                
                OJ.console.info('Ignoring exception: ', exception);
            } else {
                OJ.console.error(exception);
            }
        } finally {
            
        }
        return ret;
    });

    /*
     * Return a method wrapped in a try..catch..finally
    */
    OJ.register('method', function method(tryFunc) {
        'use strict';
        var that = this;
        return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(tryFunc);
            return OJ.tryExec.apply(that, args);
        };
    });
    

}(window.$nameSpace$));
