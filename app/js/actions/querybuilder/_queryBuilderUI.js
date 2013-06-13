/* jshint undef: true, unused: true */
/* global Ext  */

(function(n$) {
    // Init the singleton.  Any tag-based quick tips will start working.
    Ext.tip.QuickTipManager.init();

    // create main application namespace $nameSpace$.sql
    Ext.namespace( n$.name + '.sql');


    Ext.application({
        name: n$.name,
        appFolder: 'sql',
        autoCreateViewport: false,
        errorHandler: function(err) {
            Cs2.console.error(err);
        },
        launch: function() {
            Ext.Error.handle = this.errorHandler;
            // copy application to $nameSpace$.sql so that $nameSpace$.sql.app can be used as an application singleton
            var qbWindow = Ext.create('Ext.' + n$.name);
            qbWindow.show();
            Ext.apply(n$.sql, this);
        }
    });
}(window.$nameSpace$));
