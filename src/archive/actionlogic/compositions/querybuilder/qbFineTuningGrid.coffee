#jshint undef: true, unused: true 

#global OJ:true, window:true, Ext:true, $: true 
((OJ) ->
  initFineTuningGrid = (gridDef) ->
    
    ###
    Instance a collection of fields to describe a row in the SQL output table
    ###
    SqlFineTuningModel = OJ.dataModels.dataModel(
      name: "Ext." + OJ.name + ".SqlFineTuningModel"
      dataTypeCollection: [
        ["id"]
        ["tableName"]
        ["tableId"]
        ["extCmpId"]
        ["tableAlias"]
        ["field"]
        [
          "output"
          "boolean"
        ]
        ["expression"]
        ["aggregate"]
        ["alias"]
        ["sortType"]
        ["sortOrder"]
        [
          "grouping"
          "boolean"
        ]
        ["criteria"]
      ]
    )
    OJ.actions.querybuilder.register "SqlFineTuningModel", SqlFineTuningModel
    
    ###
    Define the store
    ###
    SqlFineTuningStore = OJ.stores.store(
      name: "Ext." + OJ.name + ".SqlFineTuningStore"
      dataModel: OJ.actions.querybuilder.SqlFineTuningModel
    )
    
    ###
    Put the class into the namespace
    ###
    OJ.actions.querybuilder.register "SqlFineTuningStore", SqlFineTuningStore
    
    ###
    Define the grid
    ###
    grid = OJ.grids.grid(
      name: "Ext." + OJ.name + ".qbFineTuningGrid"
      requires: ["Ext.ux.CheckColumn"]
      id: "qbFineTuningGrid"
      store: "SqlFineTuningStore" #new OJ.actions.querybuilder.SqlFineTuningStore(),
      alias: ["widget.qbFineTuningGrid"]
      plugins: [window.Ext.create("Ext.grid.plugin.CellEditing",
        clicksToEdit: 1
      )]
      columnLines: true
    )
    
    ###
    Add the subscribers
    ###
    
    # What should happen after the drop?
    grid.subscribers.add(OJ.grids.constants.subscribers.render, (view) ->
      @dd = {}
      @dd.dropZone = new Ext.grid.ViewDropZone(
        view: view
        ddGroup: "SQLTableGridDDGroup"
        handleNodeDrop: (data, record, position) ->
      )
      return
    ).add OJ.grids.constants.subscribers.drop, (node, data, dropRec, dropPosition) ->
      
      # add new rows to the qbFineTuningGrid after a drop
      OJ.each data.records, (rec) ->
        OJ.actions.sql.manager.select.fields.addFieldRecord rec, false
        return

      return

    
    ###
    Field Grid specific method
    @param grid {Ext.grid.View} the grid
    @param record {Object} The row in question
    @param index {Number} The position of the row
    @param direction {Number} The direction of movement
    ###
    moveGridRow = (grid, record, index, direction) ->
      store = grid.getStore()
      if direction < 0
        index--
        return  if index < 0
      else
        index++
        return  if index >= grid.getStore().getCount()
      
      # prepare manual syncing
      store.suspendAutoSync()
      
      # disable firing store events
      store.suspendEvents()
      
      # remove record and insert record at new index
      store.remove record
      store.insert index, record
      
      # enable firing store events
      store.resumeEvents()
      store.resumeAutoSync()
      
      # manual sync the store
      store.sync()
      return

    
    ###
    Define the action column
    ###
    actionColumn = OJ.grids.columns.actionColumn(false, "Action", true)
    actionColumn.addItem(OJ.grids.columns.columnItem("img/up_arrow.gif", "Move Column Up", onGetClass = (index) ->
      index is 0
    , onHandler = (grid, rowIndex, colIndex) ->
      rec = grid.getStore().getAt(rowIndex)
      moveGridRow grid, rec, rowIndex, -1
      return
    )).addItem(OJ.grids.columns.columnItem("img/down_arrow.gif", "Move Column Down", onGetClass = (index, store) ->
      (index + 1) is store.getCount()
    , onHandler = (grid, rowIndex, colIndex) ->
      rec = grid.getStore().getAt(rowIndex)
      moveGridRow grid, rec, rowIndex, 1
      return
    )).addItem OJ.grids.columns.columnItem("img/remove.gif", "Remove Column", null, onHandler = (grid, rowIndex, colIndex) ->
      rec = grid.getStore().getAt(rowIndex)
      store = undefined
      tableId = undefined
      tableGrid = undefined
      selectionModel = undefined
      bDel = true
      
      # rec contains column grid model, the one to remove
      # get tableId of original qbSqlWindowTable
      tableId = rec.get("extCmpId")
      
      # get the sql tables grid and its selection
      tableGrid = Ext.getCmp(tableId).down("gridpanel")
      selectionModel = tableGrid.getSelectionModel()
      Ext.Array.each selectionModel.getSelection(), (selection) ->
        
        # deselect the selection wich corresponds to the column
        # we want to remove from the column grid
        if rec.get("id") is selection.get("id")
          
          # deselect current selection
          # deselection will lead to removal, look for method deselect at the qbTableGrid
          selectionModel.deselect selection
          bDel = false
        return

      if bDel
        store = grid.getStore()
        store.remove rec
      return
    )
    
    ###
    Define the columns
    ###
    grid.columnCollection.add(actionColumn).add(OJ.grids.columns.checkColumn(false, "Output", true)).add(OJ.grids.columns.gridColumn(false, "Expression", true, 0.225, "textfield")).add(OJ.grids.columns.gridColumn(false, "Aggregate", true, null, "textfield")).add(OJ.grids.columns.gridColumn(false, "Alias", true, null, "textfield")).add(OJ.grids.columns.gridColumn(false, "Sort Type", true)).add(OJ.grids.columns.gridColumn(false, "Sort Order", true)).add(OJ.grids.columns.checkColumn(false, "Grouping", true)).add OJ.grids.columns.gridColumn(false, "Criteria", true, null, "textfield")
    
    ###
    Create the grid
    ###
    grid.init()
    xtype: "qbFineTuningGrid"
    border: false
    region: "south"
    height: 120
    split: true

  OJ.actions.querybuilder.register "qbFineTuningGrid", initFineTuningGrid
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
