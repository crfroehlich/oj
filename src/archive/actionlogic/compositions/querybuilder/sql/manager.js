/* jshint undef: true, unused: true */
/* global Ext  */

(function (OJ) {

    /*
     * SQL Manager is defined but dormant until initialzed
    */
    var init = (function() {
        /*
         * SQL Manager exposes a connections array and a OJ.actions.sql.select property
        */
        var manager = function () {
            var ret = OJ.object();
            ret.add('connections', []);
            ret.add('select', OJ.actions.sql.select());
            OJ.actions.sql.register('manager', ret);
            return ret;
        };
        return manager;

    }());
    OJ.actions.sql.register('init', init);

}((typeof global !== "undefined" && global ? global : (typeof window !== "undefined" ? window : this)).OJ));
