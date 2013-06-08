/* global window:true, Ext:true */

/*
 * Responsible for rendering the final SQL output
*/
(function() {

    /*
     * Define a panel
    */
    var panel = OJ.panels.panel({
        name: 'Ext.OJ.qbOutputPanel',
        alias: ['widget.qbOutputPanel'],
        id: 'qbOutputPanel'
    });

    panel.listeners.add(OJ.panels.constants.listeners.afterlayout, function() {
        window.SyntaxHighlighter.highlight();
    });

    var qbOutputPanel = panel.init();
    OJ.actions.querybuilder.lift('qbOutputPanel', qbOutputPanel);

}());