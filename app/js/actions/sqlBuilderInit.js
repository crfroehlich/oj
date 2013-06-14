/* jshint undef: true, unused: true */
/* global Ext  */

(function (n$) {


        Ext.define('Ext.' + n$.name, {
            extend: 'Ext.window.Window',
            alias: ['widget.qbwindow'],
            height: 620,
            width: 1000,
            layout: {
                type: 'border'
            },
            title: 'Visual SQL Query Builder',
            items: [{
                xtype: 'qbOutputPanel',
                border: false,
                region: 'center',
                autoScroll: true,
                html: '<pre class="brush: sql">SQL Output Window</pre>',
                margin: 5,
                height: 150,
                split: true
            }, {
                xtype: 'panel',
                border: false,
                height: 400,
                margin: 5,
                layout: {
                    type: 'border'
                },
                region: 'north',
                split: true,
                items: [{
                    xtype: 'qbTablePanel',
                    border: false,
                    region: 'center',
                    height: 280,
                    split: true,
                    layout: 'fit'
                }, {
                    xtype: 'qbFineTuningGrid',
                    border: false,
                    region: 'south',
                    height: 120,
                    split: true
                }, {
                    xtype: 'qbTablesTree',
                    border: false,
                    region: 'west',
                    width: 200,
                    height: 400,
                    split: true
                }]
            }],
            initComponent: function () {
                n$.actions.sql.init();

                // disable gutter (linenumbers) and toolbar for SyntaxHighlighter
                window.SyntaxHighlighter.defaults['gutter'] = false;
                window.SyntaxHighlighter.defaults['toolbar'] = false;

                // add toolbar to the dockedItems
                this.dockedItems = [{
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

                this.callParent(arguments);
            }
        });
    
}(window.$nameSpace$));
