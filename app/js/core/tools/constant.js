/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function (n$) {

    /**
     * Create a new object with constant properties.
     * @param props {Object} an object represent the enun members
    */
    var Constant = function (props) {
        var that = null;
        var keys = [];

        if (props) {
            that = this;
            n$.property(that, 'has',
                /**
                * Assert that the provided key is a member of the enum
                * @param key {String} enum property name
                */
                function (key) {
                    return keys.indexOf(key) !== -1;
                });

            n$.each(props, function (propVal, propName) {
                keys.push(propVal);
                Object.defineProperty(that, propName, {
                    value: propVal
                });
            });
        }
        return that;
    };

    /**
     * Create a new enum on the constants namespace.
     * Enums are objects consisting of read-only, non-configurable, non-enumerable properties.
     * @param name {String} the name of the enum
     * @param props {Object} the properties of the enum
    */
    n$.register('constant', function (n$, name, props) {
        var ret = new Constant(props);
        n$ = n$ || n$;
        if (ret && n$.constants && n$.constants.register && name) {
            n$.constants.register(name, ret);
            Object.seal(ret);
            Object.freeze(ret);
        }
        return ret;
    });

}(window.$nameSpace$));
