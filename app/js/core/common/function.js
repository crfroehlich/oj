/*global n$:true*/
(function(n$){

    /*
     * Wrap the execution of a method in a try..catch..finally 
    */
    n$.register('tryExec', function tryExec(tryFunc) {
        'use strict';
        var ret = false;
        var that = this;
        try {
            if (n$.is.func(tryFunc)) {
                ret = tryFunc.apply(that, Array.prototype.slice.call(arguments, 1));
            }
        } catch(exception) {
            if ((exception.name === 'TypeError' ||
                exception.type === 'called_non_callable') &&
                exception.type === 'non_object_property_load') { /* ignore errors failing to exec self-executing functions */
                
                n$.console.info('Ignoring exception: ', exception);
            } else {
                n$.console.error(exception);
            }
        } finally {
            
        }
        return ret;
    });

    /*
     * Return a method wrapped in a try..catch..finally
    */
    n$.register('method', function method(tryFunc) {
        'use strict';
        var that = this;
        return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(tryFunc);
            return n$.tryExec.apply(that, args);
        };
    });
    

}(window.$nameSpace$));
