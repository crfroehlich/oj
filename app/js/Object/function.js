/*global OJ:true*/
(function(){
	
	OJ.lift('tryExec', function(func) {
        'use strict';
        var ret = false;
        try {
            if (OJ.is.func(func)) {
                ret = func.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        } catch(exception) {
            if ((exception.name !== 'TypeError' ||
                exception.type !== 'called_non_callable') &&
                exception.type !== 'non_object_property_load') { /* ignore errors failing to exec self-executing functions */
                OJ.console.error(exception);
            }
        } finally {
            return ret;
        }
    });

    OJ.lift('tryThisThenThat', function(first, second) {
        'use strict';
        var ret = false;
        try {
            if (OJ.is.func(first)) {
                ret = first.apply(this, Array.prototype.slice.call(arguments, 2));
            }
        } catch(exception) {
            if ((exception.name !== 'TypeError' ||
                exception.type !== 'called_non_callable') &&
                exception.type !== 'non_object_property_load') { /* ignore errors failing to exec self-executing functions */
                OJ.console.error(exception);
                try {
                    if (OJ.is.func(second)) {
                        ret = second.apply(this, Array.prototype.slice.call(arguments, 2));
                    }
                } catch(e) {
                    
                }
            }
        } finally {
            return ret;
        }
    });

    
    OJ.lift('method', function(func) {
        'use strict';
        var that = this;
        return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(func);
            return OJ.tryExec.apply(that, args);
        };
    });

}());