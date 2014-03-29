# jshint undef: true, unused: true 

# global window:true, Ext:true, $: true 

###
The Table Store represents the data bound to a Database Table
###
(_joinsStoreIIFE = (OJ) ->
  
  ###
  Instance a data type collection to describe a table in the table Tree
  ###
  SqlTableNameModel = OJ.dataModels.dataModel(
    name: "Ext." + OJ.name + ".SqlTableNameModel"
    dataTypeCollection: [
      ["id"]
      ["tableName"]
      ["tableAlias"]
    ]
  )
  OJ.actions.querybuilder.register "SqlTableNameModel", SqlTableNameModel
  
  ###
  Define the store
  ###
  SqlTableNameStore = OJ.stores.store(
    name: "Ext." + OJ.name + ".SqlTableNameStore"
    dataModel: OJ.actions.querybuilder.SqlTableNameModel
  )
  
  ###
  Put the class into the namespace
  ###
  OJ.actions.querybuilder.register "SqlTableNameStore", SqlTableNameStore
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
