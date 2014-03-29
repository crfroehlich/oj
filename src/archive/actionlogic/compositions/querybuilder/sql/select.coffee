#global window:true, Ext:true 
((OJ) ->
  sortTablesByJoins = (ret, tables, oUsedTables) ->
    aTables = []
    oTemp = undefined
    aJoins = []
    oUsedTables = oUsedTables or {}
    
    # loop over tables
    i = 0
    aCondition = []
    aJoin = undefined
    l = tables.length

    while i < l
      
      # check if current table is a new one
      unless oUsedTables.hasOwnProperty(tables[i].get("id"))
        
        # it is a new one
        aTables.push tables[i]
        
        # mark table as used
        oUsedTables[tables[i].get("id")] = true
        
        # get any joins for the current table
        aJoin = ret.joins.getJoinsByTableId(tables[i].get("id"))
        
        # loop over the join tables
        j = 0
        joinTable = undefined
        len = aJoin.length

        while j < len
          
          # check if it is a new join
          unless oUsedTables.hasOwnProperty(aJoin[j].get("id"))
            
            # mark join as used
            oUsedTables[aJoin[j].get("id")] = true
            unless tables[i].get("id") is aJoin[j].get("leftTableId")
              joinTable = ret.tables.getTableById(aJoin[j].get("leftTableId"))
              ret.changeLeftRightOnJoin aJoin[j]
            else
              joinTable = ret.tables.getTableById(aJoin[j].get("rightTableId"))
            oTemp = ret.sortTablesByJoins([joinTable], oUsedTables)
            oUsedTables = oTemp.oUsedTables
            aTables = aTables.concat(oTemp.aTables)
          j++
      i++
    aTables: aTables
    oUsedTables: oUsedTables

  changeLeftRightOnJoin = (ret, join) ->
    leftTable = undefined
    leftTableField = undefined
    rightTable = undefined
    rightTableField = undefined
    joinCondition = ""
    
    # prepare new data
    leftTable = ret.tables.getTableById(join.get("rightTableId"))
    leftTableField = join.get("rightTableField")
    rightTable = ret.tables.getTableById(join.get("leftTableId"))
    rightTableField = join.get("leftTableField")
    
    # construct new joinCondition
    unless leftTable.get("tableAlias") is ""
      joinCondition = joinCondition + leftTable.get("tableAlias") + "." + join.get("rightTableField") + "="
    else
      joinCondition = joinCondition + leftTable.get("tableName") + "." + join.get("rightTableField") + "="
    unless rightTable.get("tableAlias") is ""
      joinCondition = joinCondition + rightTable.get("tableAlias") + "." + join.get("leftTableField")
    else
      joinCondition = joinCondition + rightTable.get("tableName") + "." + join.get("leftTableField")
    
    # start transaction
    join.beginEdit()
    
    # change left and right join table data
    join.set "leftTableId", leftTable.get("id")
    join.set "leftTableField", leftTableField
    join.set "rightTableId", rightTable.get("id")
    join.set "rightTableField", rightTableField
    join.set "joinCondition", joinCondition
    
    # silent commit without firing store events
    # this prevents endless loop
    join.commit true
    join.endEdit()
    
    # end transaction
    return

  arrayRemove = (array, filterProperty, filterValue) ->
    aReturn = undefined
    aReturn = Ext.Array.filter(array, (item) ->
      bRemove = true
      bRemove = false  if item[filterProperty] is filterValue
      bRemove
    )
    aReturn

  updateSQLOutput = (ret) ->
    sqlOutput = undefined
    sqlHTML = undefined
    sqlQutputPanel = undefined
    sqlOutput = ret.sqlToString()
    sqlHTML = "<pre class=\"brush: sql\">" + sqlOutput + "</pre>"
    sqlQutputPanel = Ext.getCmp("qbOutputPanel")
    sqlQutputPanel.update sqlHTML
    return

  sqlToString = (ret) ->
    sqlOutput = "SELECT "
    aJoins = []
    aOutputFields = []
    oJoinTables = {}
    aTables = []
    aCriteriaFields = []
    aGroupFields = []
    aOrderFields = []
    selectFieldsSQL = ""
    fromSQL = ""
    aFromSQL = []
    criteriaSQL = ""
    orderBySQL = ""
    groupBySQL = ""
    fieldSeperator = ", "
    joinSQL = ""
    bFirst = true
    ret.fields.each (field) ->
      
      # should the field be a part of the output
      aOutputFields.push field  if field.get("output")
      
      # any criteria
      aCriteriaFields.push field  unless field.get("criteria") is ""
      
      # check for grouping
      aGroupFields.push field  if field.get("grouping")
      
      # check for sorting
      aOrderFields.push field  unless field.get("sortType") is ""
      return

    
    # tables
    # sorting of tables
    ret.tables.each (table) ->
      aTables.push table
      return

    aTables = ret.sortTablesByJoins(aTables).aTables
    ret.joins.each (join) ->
      aJoins.push join
      return

    
    #create fromSQL
    k = 0
    aJoin = []
    oJoinTables = {}
    joinCondition = ""
    joinType = undefined
    leftTable = undefined
    rightTable = undefined
    l = aTables.length

    while k < l
      if k is aTables.length - 1
        fieldSeperator = ""
      else
        fieldSeperator = ", "
      
      # is the current table the first one
      if bFirst
        
        # yes it is the first
        
        # table id merken
        oJoinTables[aTables[k].get("id")] = true
        bFirst = false
        
        # check if current table is not the last one in the loop
        if (k + 1) < aTables.length
          
          # get joins where joins leftTableID is a property of oJoinTables and joins rightTableID equal to aTables[i+1].get('id')
          h = 0
          len = aJoins.length

          while h < len
            aJoin.push aJoins[h]  if oJoinTables.hasOwnProperty(aJoins[h].get("leftTableId")) and aJoins[h].get("rightTableId") is aTables[k + 1].get("id")
            if oJoinTables.hasOwnProperty(aJoins[h].get("rightTableId")) and aJoins[h].get("leftTableId") is aTables[k + 1].get("id")
              ret.changeLeftRightOnJoin aJoins[h]
              aJoin.push aJoins[h]
            h++
          
          # check if we have a join
          if aJoin.length > 0
            
            # yes we have a join between aTables[k] and aTables[k+1] with at least one join condition
            leftTable = aTables[k]
            rightTable = aTables[k + 1]
            
            # table id merken
            oJoinTables[rightTable.get("id")] = true
            j = 0
            fieldSeperator = ""
            ln = aJoin.length

            while j < ln
              if j is aJoin.length - 1
                fieldSeperator = ""
              else
                fieldSeperator = "\nAND "
              joinType = aJoin[j].get("joinType")
              joinCondition = joinCondition + aJoin[j].get("joinCondition") + fieldSeperator
              j++
            
            # reset the join array
            aJoin = []
            joinSQL = joinSQL + ",\n"  unless joinSQL is ""
            joinType = joinType or "INNER"
            unless leftTable.get("tableAlias") is ""
              
              # we have an leftTable alias
              joinSQL = joinSQL + leftTable.get("tableName") + " " + leftTable.get("tableAlias") + " " + joinType + " JOIN "
            else
              
              #no alias
              joinSQL = joinSQL + leftTable.get("tableName") + " " + joinType + " JOIN "
            unless rightTable.get("tableAlias") is ""
              
              # we have an rightTable alias
              joinSQL = joinSQL + rightTable.get("tableName") + " " + rightTable.get("tableAlias") + " ON " + joinCondition
            else
              
              #no alias
              joinSQL = joinSQL + rightTable.get("tableName") + " ON " + joinCondition
            
            # clear joinCondition
            joinCondition = ""
          else
            
            # no join between aTables[i+1] and the one before
            bFirst = true
            oJoinTables = {}
            
            # check for tableAlias
            unless aTables[k].get("tableAlias") is ""
              fromSQL = aTables[k].get("tableName") + " " + aTables[k].get("tableAlias")
            else
              fromSQL = aTables[k].get("tableName")
            aFromSQL.push fromSQL
        else
          
          # its the last and only one in the loop
          # check for tableAlias
          unless aTables[k].get("tableAlias") is ""
            fromSQL = aTables[k].get("tableName") + " " + aTables[k].get("tableAlias")
          else
            fromSQL = aTables[k].get("tableName")
          aFromSQL.push fromSQL
      else
        
        # no, it is not the first table
        bFirst = true
        
        # check if current table is not the last one in the loop
        if (k + 1) < aTables.length
          
          # get joins where joins leftTableID is a property of oJoinTables and joins rightTableID equal to aTables[i+1].get('id')
          h = 0
          len = aJoins.length

          while h < len
            aJoin.push aJoins[h]  if oJoinTables.hasOwnProperty(aJoins[h].get("leftTableId")) and aJoins[h].get("rightTableId") is aTables[k + 1].get("id")
            if oJoinTables.hasOwnProperty(aJoins[h].get("rightTableId")) and aJoins[h].get("leftTableId") is aTables[k + 1].get("id")
              ret.changeLeftRightOnJoin aJoins[h]
              aJoin.push aJoins[h]
            h++
          
          # check if we have a join
          if aJoin.length > 0
            
            # yes we have a join between aTables[k] and aTables[k+1] with at least one join condition
            rightTable = aTables[k + 1]
            
            # table id merken
            oJoinTables[rightTable.get("id")] = true
            j = 0
            fieldSeperator = ""
            ln = aJoin.length

            while j < ln
              if j is aJoin.length - 1
                fieldSeperator = ""
              else
                fieldSeperator = "\nAND "
              joinType = aJoin[j].get("joinType")
              joinCondition = joinCondition + aJoin[j].get("joinCondition") + fieldSeperator
              j++
            
            # reset the join array
            aJoin = []
            bFirst = false
            unless rightTable.get("tableAlias") is ""
              
              # we have an rightTable alias
              joinSQL = joinSQL + "\n" + joinType + " JOIN " + rightTable.get("tableName") + " " + rightTable.get("tableAlias") + " ON " + joinCondition
            else
              
              #no alias
              joinSQL = joinSQL + "\n" + joinType + " JOIN " + rightTable.get("tableName") + " ON " + joinCondition
            
            # clear joinCondition
            joinCondition = ""
          else
            bFirst = true
            oJoinTables = {}
        else
          
          # its the last and only one
          # check for tableAlias
          oJoinTables = {}
      k++
    fromSQL = aFromSQL.join(", ")
    joinSQL = joinSQL + ", "  if joinSQL isnt "" and fromSQL isnt ""
    fromSQL = "\nFROM " + joinSQL + fromSQL
    
    # output fields
    iOut = 0
    l = aOutputFields.length

    while iOut < l
      
      # check if it is the last array member
      if iOut is aOutputFields.length - 1
        fieldSeperator = ""
      else
        fieldSeperator = ", "
      
      # yes, output
      # check alias
      unless aOutputFields[iOut].get("alias") is ""
        
        # yes, we have an field alias
        selectFieldsSQL = selectFieldsSQL + aOutputFields[iOut].get("expression") + " AS " + aOutputFields[iOut].get("alias") + fieldSeperator
      else
        
        # no field alias
        selectFieldsSQL = selectFieldsSQL + aOutputFields[iOut].get("expression") + fieldSeperator
      iOut += 1
    
    # criteria
    iWhere = 0
    l = aCriteriaFields.length

    while iWhere < l
      if iWhere is 0
        criteriaSQL = criteriaSQL + "\nWHERE "
      else
        criteriaSQL = criteriaSQL + "AND "
      if iWhere is aCriteriaFields.length - 1
        fieldSeperator = ""
      else
        fieldSeperator = "\n"
      criteriaSQL = criteriaSQL + aCriteriaFields[iWhere].get("expression") + " " + aCriteriaFields[iWhere].get("criteria") + fieldSeperator
      iWhere += 1
    
    # group by
    iGroup = 0
    l = aGroupFields.length

    while iGroup < l
      
      # check if it is the last array member
      if iGroup is aGroupFields.length - 1
        fieldSeperator = ""
      else
        fieldSeperator = ", "
      groupBySQL = "\nGROUP BY "  if iGroup is 0
      groupBySQL = groupBySQL + aGroupFields[iGroup].get("expression") + fieldSeperator
      iGroup += 1
    
    # order by
    iOrder = 0
    l = aOrderFields.length

    while iOrder < l
      
      # check if it is the last array member
      if iOrder is aOrderFields.length - 1
        fieldSeperator = ""
      else
        fieldSeperator = ", "
      iOrder += 1
    sqlOutput + selectFieldsSQL + fromSQL + criteriaSQL + groupBySQL + orderBySQL

  select = ->
    ret = OJ.object()
    ret.add "tables", OJ.actions.sql.tables(ret)
    ret.add "fields", OJ.actions.sql.fields(ret)
    ret.add "joins", OJ.actions.sql.joins(ret)
    ret.add "sortTablesByJoins", OJ.fun.curryLeft(sortTablesByJoins, ret)
    ret.add "changeLeftRightOnJoin", OJ.fun.curryLeft(changeLeftRightOnJoin, ret)
    ret.add "arrayRemove", arrayRemove
    ret.add "updateSQLOutput", OJ.fun.curryLeft(updateSQLOutput, ret)
    ret.add "sqlToString", OJ.fun.curryLeft(sqlToString, ret)
    ret

  OJ.actions.sql.register "select", select
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
