/* global window:true, Ext:true */

(function(n$) {

    var initTableTree = function(tabTreeDef) {

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
        var tree = n$.trees.tree({
            id: 'qbTablesTree',
            //TODO: expose
            store: n$.trees.treeStore({
                rootText: 'Tables',
                children: [
                    n$.trees.treeNode({ text: 'library' }),
                    n$.trees.treeNode({ text: 'shelf' }),
                    n$.trees.treeNode({ text: 'floor' }),
                    n$.trees.treeNode({ text: 'room' }),
                    n$.trees.treeNode({ text: 'book' })]
            })
        });

        /**
         * Add the subscribers
        */
        tree.subscribers.add(n$.trees.constants.subscribers.afterrender, function(extView, eOpts) {
            var that = extView;
            initTreeDragZone(that, tree);
        });

        tree.subscribers.add(n$.trees.constants.subscribers.itemdblclick, function(extView, record, item, index, e, eOpts) {
            var qbTablePanel;
            // add a qbSqlWindowTable to the qbTablePanel component
            qbTablePanel = Ext.getCmp('qbTablePanel');
            qbTablePanel.add({
                xtype: 'qbSqlWindowTable',
                constrain: true,
                title: record.get('text')
            }).show();
        });

        tree.init();

        return {
            xtype: 'qbTablesTree',
            border: false,
            region: 'west',
            width: 200,
            height: 400,
            split: true
        };
    };
    n$.actions.querybuilder.register('qbTablesTree', initTableTree);

}(window.$nameSpace$));


