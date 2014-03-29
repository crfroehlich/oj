# jshint undef: true, unused: true 

# global window:true, Ext:true, $: true 

###
The Tabble Join Store represents the join data bound between columns across tables
###
(_joinsStoreIIFE = (OJ) ->
  
  ###
  Instance a collection of fields to describe a JOIN in the SQL output table
  ###
  SqlDragDropTableJoinModel = OJ.dataModels.dataModel(
    name: "Ext." + OJ.name + ".SqlDragDropTableJoinModel"
    dataTypeCollection: [
      ["id"]
      ["leftTableId"]
      ["rightTableId"]
      ["leftTableField"]
      ["rightTableField"]
      ["joinCondition"]
      [
        "joinType"
        "boolean"
      ]
    ]
  )
  OJ.actions.querybuilder.register "SqlDragDropTableJoinModel", SqlDragDropTableJoinModel
  
  ###
  Define the store
  ###
  SqlDragDropTableJoinStore = OJ.stores.store(
    name: "Ext." + OJ.name + ".SqlDragDropTableJoinStore"
    dataModel: OJ.actions.querybuilder.SqlDragDropTableJoinModel
  )
  
  ###
  Put the class into the namespace
  ###
  OJ.actions.querybuilder.register "SqlDragDropTableJoinStore", SqlDragDropTableJoinStore
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
