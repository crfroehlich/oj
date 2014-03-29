# jshint undef: true, unused: true 

# global Ext  
((OJ) ->
  fields = (select) ->
    ret = new OJ.actions.querybuilder.SqlFineTuningStore(storeId: "SqlFineTuningStore")
    ret.handleSQLFieldChanges = (fieldStore, model, operation) ->
      select.updateSQLOutput()  if operation is "commit"
      return

    ret.handleSQLFieldRemove = (fieldStore) ->
      select.updateSQLOutput()
      return

    ret.on "update", ret.handleSQLFieldChanges, select
    ret.on "remove", ret.handleSQLFieldRemove, select
    ret.updateFieldTableData = (table) ->
      tableId = undefined
      expression = undefined
      tableAlias = undefined
      tableName = undefined
      tableId = table.get("id")
      tableAlias = table.get("tableAlias")
      tableName = table.get("tableName")
      
      # loop over all fields of the fields store
      ret.each (field) ->
        
        # check if current field belongs to sql table
        if field.get("tableId") is tableId
          unless tableAlias is ""
            
            # we have a table alias
            expression = tableAlias + "." + field.get("field")
          else
            
            # no table alias
            expression = tableName + "." + field.get("field")
          field.beginEdit()
          
          # update the field table alias
          field.set "tableAlias", tableAlias
          
          # update the field expression
          field.set "expression", expression
          field.commit true
          field.endEdit()
        return

      ret

    ret.removeFieldById = (id) ->
      field = undefined
      field = ret.getById(id)
      ret.remove field
      ret

    ret.removeFieldsByTableId = (tableId) ->
      aRecords = []
      ret.each (model) ->
        aRecords.push model  if model.get("tableId") is tableId
        return

      ret.remove aRecords
      ret

    ret.addFieldRecord = (record, bOutput) ->
      tableAlias = undefined
      model = undefined
      expression = undefined
      
      # get the tableAlias
      tableAlias = select.tables.getTableById(record.get("tableId")).get("tableAlias")
      
      # build the expression
      # check if the tableAlias is not an empty string
      unless tableAlias is ""
        
        # alias is not an empty string
        expression = tableAlias + "." + record.get("field")
      else
        
        # alias is an empty string
        expression = record.get("tableName") + "." + record.get("field")
      
      # get a new field instance
      model = ret.getNewField()
      
      # set the expression
      model.set "expression", expression
      
      # set output to false per default
      model.set "output", bOutput
      
      # set an id, so it is possible to remove rows if the associated table is removed
      model.set "id", record.get("id")
      
      # set the field
      model.set "field", record.get("field")
      
      # copy tableId to the new model instance
      model.set "tableId", record.get("tableId")
      
      # copy cmp id of origin qbSqlWindowTable to the new model instance
      model.set "extCmpId", record.get("extCmpId")
      ret.addField model
      ret

    ret.addField = (field) ->
      ret.add field
      ret

    ret.getNewField = ->
      new OJ.actions.querybuilder.SqlFineTuningModel()

    ret

  OJ.actions.sql.register "fields", fields
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
