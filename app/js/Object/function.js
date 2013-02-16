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

    /***
     * Method to create a Class with optional inheritance.
     * Generally, I oppose this semantic in JS:
     * partly because of the ineffability of the 'this' operator,
     * and partly because of the difficulty in grokking this.
     * What we're really saying here (through the wonders of functional programming) is this:
     *
     *      var MyClass1 = function(param1) {
     *          var ret = this;
     *          ret.id = param1;
     *          return ret;
     *      };
     *
     *      var MyClass2 = function(param1, param2) {
     *          var ret = this;
     *          MyClass1.apply(this, Array.prototype.slice.call(arguments, 0));
     *          ret.name = param2;
     *          return ret;
     *      };
     *
     *      MyClass2.prototype = new MyClass1;
     *      MyClass2.prototype.constructor = MyClass1;
     *      MyClass2.prototype.parent = MyClass1.prototype;
     *
     * I find this whole mode of operation as dull as it is stupid.
     * Nonetheless, there are occassions when the convention is suitable for type checking,
     * as you'll come to see in metadata.
     *
     * Obviously, this method has very little utility if you are not using protypical inheritance
    */
    OJ.lift('Class', function(name, inheritsFrom, callBack) {
        var obj = Object.create(null);
        obj[name] = function() {
            try {
                if(inheritsFrom ) {
                    inheritsFrom.apply(this, Array.prototype.slice.call(arguments, 0));
                }
                callBack.apply(this, Array.prototype.slice.call(arguments, 0));
            } catch(e) {
                OJ.errors.ClassInheritanceError('OJ failed to execute all or part of its callback routine for Class: ' + name);
            }
        };
        if(inheritsFrom) {
            obj[name].inheritsFrom(inheritsFrom);
        }
        return obj[name];
    });


}());