#global window:true, Ext:true,Faker 
((OJ) ->
  initTableTree = (tabTreeDef) ->
    initTreeDragZone = (thisTree, t) ->
      
      # init tree view as a ViewDragZone
      thisTree.view.dragZone = new Ext.tree.ViewDragZone(
        view: thisTree.view
        ddGroup: "sqlDDGroup"
        dragText: "{0} Selected Table{1}"
        repairHighlightColor: "c3daf9"
        repairHighlight: Ext.enableFx
      )
      return

    getRandomTableTreeNodes = ->
      ret = []
      i = 0

      while i < 15
        tableName = Faker.random.catch_phrase_noun().replace(" ", "_").replace("-", "_")
        ret.push OJ.trees.treeNode(text: tableName)
        i += 1
      ret

    
    ###
    Define the tree
    ###
    tree = OJ.trees.tree(
      id: "qbTablesTree"
      
      #TODO: expose
      store: OJ.trees.treeStore(
        rootText: "Database Tables"
        children: getRandomTableTreeNodes()
      )
    )
    
    ###
    Add the subscribers
    ###
    tree.subscribers.add OJ.trees.constants.subscribers.afterrender, (extView, eOpts) ->
      that = extView
      initTreeDragZone that, tree
      return

    tree.subscribers.add OJ.trees.constants.subscribers.itemdblclick, (extView, record, item, index, e, eOpts) ->
      qbTablePanel = undefined
      
      # add a qbSqlWindowTable to the qbTablePanel component
      qbTablePanel = Ext.getCmp("qbTablePanel")
      qbTablePanel.add(
        xtype: "qbSqlWindowTable"
        constrain: true
        title: record.get("text")
      ).show()
      return

    tree.init()
    xtype: "qbTablesTree"
    border: false
    region: "west"
    width: 200
    height: 400
    split: true

  OJ.actions.querybuilder.register "qbTablesTree", initTableTree
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
