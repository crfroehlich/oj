/* jshint undef: true, unused: true */
/* global Ext  */

(function (n$) {

    /*
     * SQL Manager is defined but dormant until initialzed
    */
    var init = (function() {
        /*
         * SQL Manager exposes a connections array and a n$.actions.sql.select property
        */
        var manager = function () {
            var ret = n$.object();
            ret.add('connections', []);
            ret.add('select', n$.actions.sql.select());
            n$.actions.sql.lift('manager', ret);
            return ret;
        };
        return manager;

    }());
    n$.actions.sql.lift('init', init);

}(window.$nameSpace$));
