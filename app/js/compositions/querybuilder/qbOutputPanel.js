/* global window:true, Ext:true */

/*
 * Responsible for rendering the final SQL output
*/
(function(n$) {

    var initOutputPanel = function(panelDef) {

        /*
         * Define a panel
        */
        var panel = n$.panels.panel({
            name: 'Ext.' + n$.name + '.qbOutputPanel',
            alias: ['widget.qbOutputPanel'],
            id: 'qbOutputPanel'
        });

        panel.subscribers.add(n$.panels.constants.subscribers.afterlayout, function() {
            window.SyntaxHighlighter.highlight();
        });

        panel.init();

        return {
            xtype: 'qbOutputPanel',
            border: false,
            region: 'center',
            autoScroll: true,
            html: '<pre class="brush: sql">SQL Output Window</pre>',
            margin: 5,
            height: 150,
            split: true
        };
    };
    
    n$.actions.querybuilder.register('qbOutputPanel', initOutputPanel);

}(window.$nameSpace$));
