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
    
    /*
     * Curry Left method
    */
    n$.register('curryLeft', function curryLeft(func) {
       var slice = Array.prototype.slice;
       var args = slice.call(arguments, 1);
       return function() {
           return func.apply(this, args.concat(slice.call(arguments, 0)));
    
       }
    });

    /*
     * Fold Left method
    */
    n$.register('foldLeft', function foldLeft(func,newArray,oldArray) {
        var accumulation = newArray;
        n$.each(oldArray, function(val) {
            accumulation = func(accumulation, val);
        });
        return accumulation;
    });

    /*
     * Map method
    */
    n$.register('map', function map(func, array) {
        var onIteration = function(accumulation, val) {
            return accumulation.concat(func(val));
        };
        return foldLeft(onIteration, [], array)
    });

    /*
     * Filter method
    */
    n$.register('filter', function filter(func, array) {
        var onIteration = function(accumulation, val) {
            if(func(val)) {
                return accumulation.concat(val);
            } else {
                return accumulation;
            }
        };
        return foldLeft(onIteration, [], array)
    });

    /*
     * Inserts a parameter into the position of the first argument, shifting all other arguments to "the right" by one position
    */
    n$.register('shiftRight', function shiftRight(shiftFunc, firstParam, originalArguments, context) {
        context = context || this;
        var args = Array.prototype.slice.call(originalArguments, 0);
		args.unshift(firstParam);
        return shiftFunc.apply(context, args);
    });

    /*
     * Inserts a parameter into the position of the first argument, shifting all other arguments to "the right" by one position
    */
    n$.register('apply', function apply(applyFunc, originalArguments, context) {
        context = context || this;
        var args = Array.prototype.slice.call(originalArguments, 0);
    	return applyFunc.apply(context, args);
    });

}(window.$nameSpace$));
