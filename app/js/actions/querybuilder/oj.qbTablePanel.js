/* global window:true, Ext:true */

(function () {

    var panel = OJ.panels.panel({
        name: 'Ext.OJ.qbTablePanel',
        alias: ['widget.qbTablePanel'],
        id: 'qbTablePanel'
    });

    var initDropTarget = function(thisPanel) {
        // init draw component inside qbwindow as a DropTarget
        thisPanel.dropTarget = Ext.create('Ext.dd.DropTarget', thisPanel.el, {
            ddGroup: 'sqlDDGroup',
            notifyDrop: function(source, event, data) {
                var qbTablePanel;
                // add a qbSqlWindow to the qbTablePanel component
                qbTablePanel = Ext.getCmp('qbTablePanel');
                qbTablePanel.add({
                    xtype: 'qbSqlWindow',
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


}());