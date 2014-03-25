/* jshint undef: true, unused: true */
/* global Ext  */

(function (n$) {

    var initQbUI = function (qbId) {

        // Init the singleton.  Any tag-based quick tips will start working.
        Ext.tip.QuickTipManager.init();

        // create main application namespace $nameSpace$.sql
        Ext.namespace(n$.name + '.sql');

        // On init method
        var onInit = function (that) {
            n$.actions.sql.init();

            // disable gutter (linenumbers) and toolbar for SyntaxHighlighter
            window.SyntaxHighlighter.defaults['gutter'] = false;
            window.SyntaxHighlighter.defaults['toolbar'] = false;

            // add toolbar to the dockedItems
            that.dockedItems = [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'tbfill'
                }, {
                    text: "Save",
                    icon: "img/icon-save.gif"
                }, {
                    text: "Run",
                    icon: "img/run.png"
                }]
            }];
        };

        // Define the window
        var sheet = n$.sheets.sheet({
            id: qbId,
            onInit: onInit
        });

        sheet.addProp('height', 620);
        sheet.addProp('width', 1000);
        sheet.addProp('title', 'Visual SQL Query Builder');
        sheet.addProp('layout', {
            type: 'border'
        });

        // Define the layout
        var items = [
            n$.actions.querybuilder.qbOutputPanel({}),
            {
                xtype: 'panel',
                border: false,
                height: 400,
                margin: 5,
                layout: {
                    type: 'border'
                },
                region: 'north',
                split: true,
                items: [
                    n$.actions.querybuilder.qbTablePanel({}),
                    n$.actions.querybuilder.qbFineTuningGrid({}),
                    n$.actions.querybuilder.qbTablesTree({})]
            }
        ];

        sheet.addProp('items', items);

        sheet.init();
    };

    n$.actions.querybuilder.register('initQbUI', initQbUI);

}(window.$nameSpace$));
