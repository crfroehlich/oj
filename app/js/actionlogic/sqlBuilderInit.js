/* jshint undef: true, unused: true */
/* global Ext  */

(function (n$) {

    window.initQb = function() {

        n$.actions.querybuilder.initQbUI('qbwindow');
        n$.structureSets.structureSet({
            name: 'qbwindow',
            scope: 'sql'
        });

        //Ext.application({
        //    name: n$.name + '.qbwindow',
        //    appFolder: 'sql',
        //    autoCreateViewport: false,
        //    errorHandler: function(err) {
        //        Cs2.console.error(err);
        //    },
        //    launch: function() {
        //        Ext.Error.handle = this.errorHandler;
        //        // copy application to $nameSpace$.sql so that $nameSpace$.sql.app can be used as an application singleton
        //        var qbWindow = Ext.create('Ext.' + n$.name + '.qbwindow');
        //        qbWindow.show();
        //        Ext.apply(n$.sql, this);
        //    }
        //});
    };

}(window.$nameSpace$));
