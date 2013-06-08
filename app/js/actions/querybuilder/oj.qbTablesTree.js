/* global window:true, Ext:true */

(function() {

    var initTreeDragZone = function(thisTree, t) {
        // init tree view as a ViewDragZone
        thisTree.view.dragZone = new Ext.tree.ViewDragZone({
            view: thisTree.view,
            ddGroup: 'sqlDDGroup',
            dragText: '{0} Selected Table{1}',
            repairHighlightColor: 'c3daf9',
            repairHighlight: Ext.enableFx
        });
    };

    /**
     * Define the grid
    */
    var tree = OJ.trees.tree({
        name: 'Ext.OJ.qbTablesTree',
        alias: ['widget.qbTablesTree'],
        id: 'qbTablesTree',
        //TODO: expose
        store: OJ.trees.treeStore({
            rootText: 'Tables',
            children: [
                OJ.trees.treeNode({ text: 'library' }),
                OJ.trees.treeNode({ text: 'shelf' }),
                OJ.trees.treeNode({ text: 'floor' }),
                OJ.trees.treeNode({ text: 'room' }),
                OJ.trees.treeNode({ text: 'book' })]
        })
    });

    /**
     * Add the listeners
    */
    tree.listeners.add(OJ.trees.constants.listeners.afterrender, function (extView, eOpts) {
        var that = extView;
        initTreeDragZone(that, tree);
    });

    tree.listeners.add(OJ.trees.constants.listeners.itemdblclick, function (extView, record, item, index, e, eOpts) {
        var qbTablePanel;
        // add a qbSqlWindow to the qbTablePanel component
        qbTablePanel = Ext.getCmp('qbTablePanel');
        qbTablePanel.add({
            xtype: 'qbSqlWindow',
            constrain: true,
            title: record.get('text')
        }).show();
    });
    
    tree.init();

}());


