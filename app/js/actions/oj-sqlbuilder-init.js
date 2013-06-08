/* jshint undef: true, unused: true */
/* global Ext  */

// Init the singleton.  Any tag-based quick tips will start working.
Ext.tip.QuickTipManager.init();

// create main application namespace OJ.sql
Ext.namespace('OJ.sql');

window.initSqlUI();

Ext.application({
    name: 'OJ',
    appFolder: 'sql',
    autoCreateViewport: false,
    launch: function(){
        // copy application to OJ.sql so that OJ.sql.app can be used as an application singleton
        var qbWindow = Ext.create('Ext.OJ');
    	qbWindow.show();
        Ext.apply(OJ.sql, this);
    }
});