# jshint undef: true, unused: true 

# global Ext  
((OJ) ->
  joins = (select) ->
    ret = new OJ.actions.querybuilder.SqlDragDropTableJoinStore(storeId: "JoinStore")
    ret.handleSQLJoinChanges = (joinStore, join) ->
      select.updateSQLOutput()
      return

    
    # this.joins.on('update', this.handleSQLJoinChanges, this);
    ret.on "add", ret.handleSQLJoinChanges, select
    ret.on "remove", ret.handleSQLJoinChanges, select
    ret.updateJoinTableData = (table) ->
      joins = undefined
      tableId = undefined
      tableId = table.get("id")
      joins = ret.getJoinsByTableId(tableId)
      i = 0
      rightTable = undefined
      leftTable = undefined
      joinCondition = ""
      l = joins.length

      while i < l
        leftTable = select.tables.getTableById(joins[i].get("leftTableId"))
        rightTable = select.tables.getTableById(joins[i].get("rightTableId"))
        unless leftTable.get("tableAlias") is ""
          joinCondition = joinCondition + leftTable.get("tableAlias") + "." + joins[i].get("leftTableField") + "="
        else
          joinCondition = joinCondition + leftTable.get("tableName") + "." + joins[i].get("leftTableField") + "="
        unless rightTable.get("tableAlias") is ""
          joinCondition = joinCondition + rightTable.get("tableAlias") + "." + joins[i].get("rightTableField")
        else
          joinCondition = joinCondition + rightTable.get("tableName") + "." + joins[i].get("rightTableField")
        joins[i].beginEdit()
        joins[i].set "joinCondition", joinCondition
        joins[i].commit true
        joins[i].endEdit()
        i++
      return

    ret.getJoinsByTableId = (tableId) ->
      aReturn = []
      select.joins.each (join) ->
        aReturn.push join  if join.get("leftTableId") is tableId or join.get("rightTableId") is tableId
        return

      aReturn

    ret.removeJoinById = (joinID) ->
      join = undefined
      join = select.joins.getById(joinID)
      ret.remove join
      ret

    ret.addJoin = (join) ->
      ret.add join
      ret

    ret

  OJ.actions.sql.register "joins", joins
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
