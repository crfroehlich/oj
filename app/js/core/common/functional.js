/*global n$:true*/
(function(n$) {
    'use strict';

    n$.register('fun', n$.makeNameSpace());

    /*
     * Curry Left method
     */
    n$.fun.register('curryLeft', function curryLeft(func) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 1);
        return function() {
            return func.apply(this, args.concat(slice.call(arguments, 0)));
        };
    });

    /*
     * Fold Left method
     */
    n$.fun.register('foldLeft', function foldLeft(func, newArray, oldArray) {
        var accumulation = newArray;
        n$.iterate(oldArray, function(val) {
            accumulation = func(accumulation, val);
        });
        return accumulation;
    });

    /*
     * Map method
     */
    n$.fun.register('map', function map(func, array) {
        var onIteration = function(accumulation, val) {
            return accumulation.concat(func(val));
        };
        return n$.fun.foldLeft(onIteration, [], array)
    });

    /*
     * Filter method
     */
    n$.fun.register('filter', function filter(func, array) {
        var onIteration = function(accumulation, val) {
            if (func(val)) {
                return accumulation.concat(val);
            }
            else {
                return accumulation;
            }
        };
        return n$.fun.foldLeft(onIteration, [], array);
    });

    /*
     * Inserts a parameter into the position of the first argument, shifting all other arguments to "the right" by one position
     */
    n$.fun.register('shiftRight', function shiftRight(shiftFunc, firstParam, originalArguments, context) {
        context = context || this;
        var args = Array.prototype.slice.call(originalArguments, 0);
        args.unshift(firstParam);
        return shiftFunc.apply(context, args);
    });

    /*
     * Executes a method using a new context and arguments
     */
    n$.fun.register('apply', function apply(applyFunc, originalArguments, context) {
        context = context || this;
        var args = Array.prototype.slice.call(originalArguments, 0);
        return applyFunc.apply(context, args);
    });





}(window.$nameSpace$));
