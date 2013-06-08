/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _treelIIFE() {

    /**
     * Private class representing an instance of a tree store. It returns a new OJ.tree.treeStore instance.
     * @param rootText {String} The text to display for the root node
     * @param children {Array} [children=[]] An array of tree node children
     * @param proxy {String} [proxy='memory'] A proxy to render the tree
    */
    var TreeStore = function(rootText, children, proxy) {
        
        var that = Ext.create('Ext.data.TreeStore', {
            root: OJ.trees.treeNode({
                text: rootText,
                expanded: true,
                children: children
            }),
            proxy: proxy
        });
        
        return that;
    };

    OJ.instanceOf.lift('TreeStore', TreeStore);

    /**
     * Create a tree object.
     * @param treeDef.rootText {String} The text to display for the root node
     * @param treeDef.children {Array} [children=[]] An array of tree node children
     * @param treeDef.proxy {String} [proxy='memory'] A proxy to render the tree
     * @returns {OJ.trees.treeStore} A tree store object.
    */
    OJ.trees.lift('treeStore', function(treeDef) {
        if(!(treeDef)) {
            throw new Error('Cannot instance a tree store without properties');
        }
        if (!(treeDef.proxy instanceof OJ.instanceOf.Proxy)) {
            treeDef.proxy = OJ.stores.proxy('memory');
        }
        var treeStore = new TreeStore(treeDef.rootText, treeDef.children, treeDef.proxy);
        return treeStore;
    });


}());