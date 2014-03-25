/* global window:true, Ext:true */

(function (n$) {

    var initTablePanel = function(tableDef) {

        var panel = n$.panels.panel({
            id: 'qbTablePanel'
        });

        var initDropTarget = function(thisPanel) {
            // init draw component inside qbwindow as a DropTarget
            thisPanel.dropTarget = Ext.create('Ext.dd.DropTarget', thisPanel.el, {
                ddGroup: 'sqlDDGroup',
                notifyDrop: function(source, event, data) {
                    var qbTablePanel;
                    // add a qbSqlWindowTable to the qbTablePanel component
                    qbTablePanel = Ext.getCmp('qbTablePanel');
                    qbTablePanel.add({
                        xtype: 'qbSqlWindowTable',
                        constrain: true,
                        title: data.records[0].get('text')
                    }).show();
                    return true;
                }
            });
        };

        panel.addProp('items', [{
            xtype: 'draw',
            listeners: {
                afterrender: function() {
                    var thisPanel = this;
                    initDropTarget(thisPanel);
                }
            }
        }]);

        panel.init();

        return {
            xtype: 'qbTablePanel',
            border: false,
            region: 'center',
            height: 280,
            split: true,
            layout: 'fit'
        };
    };
    
    n$.actions.querybuilder.register('qbTablePanel', initTablePanel);
    
}(window.$nameSpace$));
