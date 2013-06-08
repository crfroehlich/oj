/* jshint undef: true, unused: true */
/* global Ext  */

(function () {

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
            OJ.actions.sql.lift('manager', ret);
            return ret;
        };
        return manager;

    }());
    OJ.actions.sql.lift('init', init);

}());