#jshint undef: true, unused: true 

#global OJ:true, window:true, Ext:true, $: true 
((OJ) ->
  onInit = (thisGrid) ->
    thisGrid.columns = [
      OJ.grids.columns.rendererColumn(
        width: 16
        dataIndex: "key"
        onRender: (val, meta, model) ->
          meta.style = "background-image:url(img/key.gif) !important;background-position:2px 3px;background-repeat:no-repeat;"  if val is "PRI"
          "&nbsp;"
      )
      OJ.grids.columns.rendererColumn(
        flex: 1
        dataIndex: "field"
        onRender: (val, meta, model) ->
          return "<span style=\"font-weight: bold;\">" + val + "</span>&nbsp;&nbsp;<span style=\"color:#aaa;\">" + model.get("type") + "</span>"  if model.get("key") is "PRI"
          val + "&nbsp;&nbsp;<span style=\"color:#999;\">" + model.get("type") + "</span>"
      )
    ]
    model = undefined
    selModel = OJ.selections.selectionModelCheckBox(
      name: "qbTableGridSelectionModelCheckBox"
      checkOnly: true
      onDefine: (def, that) ->
        that.subscribers.add that.subs.select, (sModel, data) ->
          
          # add new rows to the qbFineTuningGrid after a selection change
          OJ.actions.sql.manager.select.fields.addFieldRecord data, true
          return

        that.subscribers.add that.subs.deselect, (sModel, data) ->
          
          # remove row from qbFineTuningGrid after deselection
          OJ.actions.sql.manager.select.fields.removeFieldById data.get("id")
          return

        model = window.Ext.create("Ext.selection.CheckboxModel", def)
        return
    )
    thisGrid.selModel = model
    thisGrid

  
  ###
  Define the grid
  ###
  grid = OJ.grids.grid(
    name: "Ext." + OJ.name + ".qbTableGrid"
    alias: ["widget.qbTableGrid"]
    onInit: onInit
  )
  grid.addProp OJ.grids.constants.properties.hideHeaders, true
  grid.addProp OJ.grids.constants.properties.border, false
  
  ###
  Add the subscribers
  ###
  grid.subscribers.add OJ.grids.constants.subscribers.bodyscroll, ->
    scrollOffset = undefined
    qbSqlWindowTable = undefined
    
    # the bodyscroll event of the view was fired
    # get scroll information
    scrollOffset = @el.getScroll()
    
    # get the parent qbSqlWindowTable
    qbSqlWindowTable = @up("qbSqlWindowTable")
    
    # change shadowSprites scrollTop property
    qbSqlWindowTable.shadowSprite.scrollTop = scrollOffset.top
    
    # redraw all connections to reflect scroll action
    i = OJ.actions.sql.manager.connections.length

    while i--
      qbSqlWindowTable.connection OJ.actions.sql.manager.connections[i]
    return

  grid.subscribers.add OJ.grids.constants.subscribers.render, (view) ->
    @dd = {}
    
    # init the view as a DragZone
    @dd.dragZone = new Ext.view.DragZone(
      view: view
      ddGroup: "SQLTableGridDDGroup"
      dragText: "{0} selected table column{1}"
      onInitDrag: (x, y) ->
        me = this
        data = me.dragData
        view = data.view
        selectionModel = view.getSelectionModel()
        record = view.getRecord(data.item)
        e = data.event
        data.records = [record]
        me.ddel.update me.getDragText()
        me.proxy.update me.ddel.dom
        me.onStartDrag x, y
        true
    )
    
    # init the view as a DropZone
    @dd.dropZone = new Ext.grid.ViewDropZone(
      view: view
      ddGroup: "SQLTableGridDDGroup"
      handleNodeDrop: (data, record, position) ->

      
      # Was soll nach dem Drop passieren?
      onNodeOver: (node, dragZone, e, data) ->
        me = this
        view = me.view
        pos = me.getPosition(e, node)
        overRecord = view.getRecord(node)
        draggingRecords = data.records
        unless Ext.Array.contains(data.records, me.view.getRecord(node))
          if not Ext.Array.contains(draggingRecords, overRecord) and data.records[0].get("field") isnt "*"
            me.valid = true
          
          # valid drop target
          # todo show drop invitation
          else
            
            # invalid drop target
            me.valid = false
        (if me.valid then me.dropAllowed else me.dropNotAllowed)

      onContainerOver: (dd, e, data) ->
        me = this
        
        # invalid drop target
        me.valid = false
        me.dropNotAllowed
    )
    return

  grid.subscribers.add OJ.grids.constants.subscribers.drop, (node, data, dropRec, dropPosition) ->
    sqlTable1 = undefined
    sqlTable2 = undefined
    showJoinCM = undefined
    connection = undefined
    aBBPos = undefined
    join = undefined
    joinCondition = ""
    dropTable = undefined
    targetTable = undefined
    showJoinCM = (event, el) ->
      cm = undefined
      
      # stop the browsers event bubbling
      event.stopEvent()
      
      # create context menu
      cm = Ext.create("Ext.menu.Menu",
        items: [
          {
            text: "Edit Join"
            icon: "resources/images/document_edit16x16.gif"
            handler: Ext.Function.bind(->
              throw new Error("Edit Join has not been implemented.")return
            , this)
          }
          {
            text: "Remove Join"
            icon: "resources/images/remove.gif"
            handler: Ext.Function.bind(->
              
              # remove any connection lines from surface and from array OJ.actions.sql.manager.connections
              OJ.actions.sql.manager.connections = Ext.Array.filter(OJ.actions.sql.manager.connections, (connection) ->
                bRemove = true
                if @uuid is connection.uuid
                  @line.remove()
                  @bgLine.remove()
                  @miniLine1.remove()
                  @miniLine2.remove()
                  bRemove = false
                bRemove
              , this)
              OJ.actions.sql.manager.select.joins.removeJoinById @uuid
              return
            , this)
          }
          {
            text: "Close Menu"
            icon: "resources/images/cross.gif"
            handler: Ext.emptyFn
          }
        ]
      )
      
      # show the contextmenu next to current mouse position
      cm.showAt event.getXY()
      return

    if node.boundView
      sqlTable1 = data.view.up("window")
      sqlTable1.shadowSprite.bConnections = true
      sqlTable2 = Ext.getCmp(node.boundView).up("window")
      sqlTable2.shadowSprite.bConnections = true
      dropTable = OJ.actions.sql.manager.select.tables.getTableById(sqlTable1.tableId)
      targetTable = OJ.actions.sql.manager.select.tables.getTableById(sqlTable2.tableId)
      aBBPos = [
        data.item.viewIndex
        node.viewIndex
      ]
      connection = sqlTable2.connection(sqlTable2, sqlTable1.shadowSprite, sqlTable2.shadowSprite, "#000", aBBPos)
      sqlTable1.connectionUUIDs.push connection.uuid
      sqlTable2.connectionUUIDs.push connection.uuid
      OJ.actions.sql.manager.connections.push connection
      
      # bgLine is white(invisble) and its stroke-width is 10
      # so it is easier to capture the dblclick event
      connection.bgLine.el.on "contextmenu", showJoinCM, connection
      
      # line is black and its stroke-width is 1
      connection.line.el.on "contextmenu", showJoinCM, connection
      
      # create an instance of the join model
      #join = Ext.create('Ext.' + OJ.name + '.SqlDragDropTableJoinModel');
      join = new OJ.actions.querybuilder.SqlDragDropTableJoinModel()
      
      # set join id
      join.set "id", connection.uuid
      
      # sqlTable1 is the left table
      join.set "leftTableId", sqlTable1.tableId
      
      # data.records[0] represents the model of the dragged node
      join.set "leftTableField", data.records[0].get("field")
      
      # sqlTable1 is the left table
      join.set "rightTableId", sqlTable2.tableId
      
      # node.viewIndex is the index of the target node
      join.set "rightTableField", sqlTable2.down("grid").store.getAt(node.viewIndex).get("field")
      
      # set the defaul join type to INNER
      join.set "joinType", "INNER"
      unless dropTable.get("tableAlias") is ""
        joinCondition = joinCondition + dropTable.get("tableAlias") + "." + join.get("leftTableField") + "="
      else
        joinCondition = joinCondition + dropTable.get("tableName") + "." + join.get("leftTableField") + "="
      unless targetTable.get("tableAlias") is ""
        joinCondition = joinCondition + targetTable.get("tableAlias") + "." + join.get("rightTableField")
      else
        joinCondition = joinCondition + targetTable.get("tableName") + "." + join.get("rightTableField")
      join.set "joinCondition", joinCondition
      OJ.actions.sql.manager.select.joins.addJoin join
    return

  grid.init()
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
