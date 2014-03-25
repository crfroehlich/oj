/*global window,Ext*/

//window.onerror = function(msg, url, lineNumber) {

//    console.error('%s\r url: %s\r line: %d', msg, url, lineNumber);

//   //return true; //true means don't propogate the error
//};

window.Ext.Loader.setConfig({ enabled: true });

//window.Ext.Loader.setPath('Ext', '../vendor/extJS-4.1.0');
window.Ext.Loader.setPath('Ext', 'https://extjs.cachefly.net/ext-4.1.1a-gpl');
window.Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());


window.Ext.require([
    //'Ext.ux.grid.Printer',
    //'Ext.ux.data.PagingMemoryProxy',
    'Ext.ux.grid.FiltersFeature',
    //'Ext.ux.TabScrollerMenu',
    //'Ext.ux.TabReorderer',
    'Ext.ux.CheckColumn',
    //'Ext.tip.QuickTipManager',
    //'Ext.window.Window',
    //'Ext.tab.Panel',
    //'Ext.selection.CellModel',
    //'Ext.data.*',
    //'Ext.grid.*',
    //'Ext.tree.*',
    //'Ext.ux.tree.plugin.NodeDisabled'
]);