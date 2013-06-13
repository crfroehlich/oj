/* global window:true, Ext:true */

/*
 * Responsible for rendering the final SQL output
*/
(function(n$) {

    /*
     * Define a panel
    */
    var panel = n$.panels.panel({
        name: 'Ext.' + n$.name + '.qbOutputPanel',
        alias: ['widget.qbOutputPanel'],
        id: 'qbOutputPanel'
    });

    panel.listeners.add(n$.panels.constants.listeners.afterlayout, function() {
        window.SyntaxHighlighter.highlight();
    });

    var qbOutputPanel = panel.init();
    n$.actions.querybuilder.lift('qbOutputPanel', qbOutputPanel);

}(window.$nameSpace$));
