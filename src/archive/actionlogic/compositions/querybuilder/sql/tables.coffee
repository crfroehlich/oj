# jshint undef: true, unused: true 

# global Ext  
((OJ) ->
  tables = (select) ->
    ret = new OJ.actions.querybuilder.SqlTableNameStore(storeId: "SqlTableNameStore")
    ret.handleSQLTableUpdate = (tableStore, table, operation) ->
      if operation is "commit"
        select.fields.updateFieldTableData table
        select.joins.updateJoinTableData table
        select.updateSQLOutput()
      return

    ret.handleSQLTableAdd = (tableStore, table, index) ->
      select.updateSQLOutput()
      return

    ret.handleSQLTableRemove = (tableStore, table, index) ->
      aJoins = []
      
      # get table joins and remove them
      aJoins = select.joins.getJoinsByTableId(table.get("id"))
      
      # loop over the joins array
      i = 0
      l = aJoins.length

      while i < l
        
        # remove join from store
        select.joins.removeJoinById aJoins[i].get("id")
        i++
      select.updateSQLOutput()
      return

    
    # handle all updates on sql tables
    ret.on "update", ret.handleSQLTableUpdate, select
    ret.on "add", ret.handleSQLTableAdd, select
    ret.on "remove", ret.handleSQLTableRemove, select
    ret.addTable = (table) ->
      ret.add table
      ret

    ret.removeTableById = (tableID) ->
      table = undefined
      table = ret.getById(tableID)
      ret.remove table
      ret

    ret.getTableById = (tableID) ->
      ret.getById tableID

    ret

  OJ.actions.sql.register "tables", tables
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
