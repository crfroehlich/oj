# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_treelIIFE = (OJ) ->
  
  ###
  Private class representing an instance of a tree store. It returns a new OJ.tree.treeStore instance.
  @param rootText {String} The text to display for the root node
  @param children {Array} [children=[]] An array of tree node children
  @param proxy {String} [proxy='memory'] A proxy to render the tree
  ###
  TreeStore = (rootText, children, proxy) ->
    "use strict"
    that = Ext.create("Ext.data.TreeStore",
      root: OJ.trees.treeNode(
        text: rootText
        expanded: true
        children: children
      )
      proxy: proxy
    )
    that

  OJ.instanceOf.register "TreeStore", TreeStore
  
  ###
  Create a tree object.
  @param treeDef.rootText {String} The text to display for the root node
  @param treeDef.children {Array} [children=[]] An array of tree node children
  @param treeDef.proxy {String} [proxy='memory'] A proxy to render the tree
  @returns {OJ.trees.treeStore} A tree store object.
  ###
  OJ.trees.register "treeStore", treeStoreFunc = (treeDef) ->
    "use strict"
    throw new Error("Cannot instance a tree store without properties")  unless treeDef
    treeDef.proxy = OJ.stores.proxy("memory")  unless treeDef.proxy instanceof OJ.instanceOf.Proxy
    treeStore = new TreeStore(treeDef.rootText, treeDef.children, treeDef.proxy)
    treeStore

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
