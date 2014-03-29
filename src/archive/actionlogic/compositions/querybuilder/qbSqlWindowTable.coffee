#global window:true, Ext:true,Faker 
((OJ) ->
  getOffset = (thisView, constrain) ->
    xy = thisView.dd.getXY(constrain)
    s = thisView.dd.startXY
    
    # return the the difference between the current and the drag&drop start position
    [
      xy[0] - s[0]
      xy[1] - s[1]
    ]

  closeSQLTable = (thisView) ->
    
    # remove fields / columns from SqlFineTuningStore
    OJ.actions.sql.manager.select.fields.removeFieldsByTableId thisView.tableId
    
    # remove table from sqlTables store inside OJ.actions.sql.manager.sqlSelect
    OJ.actions.sql.manager.select.tables.removeTableById thisView.tableId
    
    # unregister mousedown event
    thisView.getHeader().el.un "mousedown", (_doRegStartDrag = ->
      regStartDrag thisView
      return
    ), thisView
    
    # unregister mousemove event
    Ext.EventManager.un document, "mousemove", (_doMoveWindow = ->
      moveWindow thisView
      return
    ), thisView
    
    # remove sprite from surface
    Ext.getCmp("qbTablePanel").down("draw").surface.remove thisView.shadowSprite, false
    
    # remove any connection lines from surface and from array OJ.actions.sql.manager.connections
    OJ.actions.sql.manager.connections = Ext.Array.filter(OJ.actions.sql.manager.connections, (connection) ->
      bRemove = true
      j = 0
      l = @connectionUUIDs.length

      while j < l
        if connection.uuid is @connectionUUIDs[j]
          connection.line.remove()
          connection.bgLine.remove()
          connection.miniLine1.remove()
          connection.miniLine2.remove()
          bRemove = false
        j++
      bRemove
    , thisView)
    return

  initSQLTable = (thisView) ->
    qbTablePanel = undefined
    xyParentPos = undefined
    xyChildPos = undefined
    childSize = undefined
    sprite = undefined
    
    # get the main qbTablePanel
    qbTablePanel = Ext.getCmp("qbTablePanel")
    
    # get the main qbTablePanel position
    xyParentPos = qbTablePanel.el.getXY()
    
    # get position of the previously added qbSqlWindowTable
    xyChildPos = thisView.el.getXY()
    
    # get the size of the previously added qbSqlWindowTable
    childSize = thisView.el.getSize()
    
    # create a sprite of type rectangle and set its position and size
    # to position and size of the the qbSqlWindowTable
    sprite = new OJ.actions.querybuilder.SqlTableJoinSprite(
      type: "rect"
      stroke: "#fff"
      height: childSize.height - 4
      width: childSize.width - 4
      x: xyChildPos[0] - xyParentPos[0] + 2
      y: xyChildPos[1] - xyParentPos[1] + 2
      scrollTop: 0
    )
    
    # add the sprite to the surface of the qbTablePanel
    thisView.shadowSprite = qbTablePanel.down("draw").surface.add(sprite).show(true)
    
    # handle resizeing of sqltabel
    thisView.resizer.on "resize", ((resizer, width, height, event) ->
      thisViewEl = this
      thisViewEl.shadowSprite.setAttributes
        width: width - 6
        height: height - 6
      , true
      
      # also move the associated connections
      i = OJ.actions.sql.manager.connections.length

      while i--
        connection thisViewEl, OJ.actions.sql.manager.connections[i]
      return
    ), thisView
    
    # register a function for the mousedown event on the previously added qbSqlWindowTable and bind to thisView scope
    thisView.getHeader().el.on "mousedown", (_doRegStartDrag = ->
      regStartDrag thisView
      return
    ), thisView
    thisView.getHeader().el.on "contextmenu", (_doShowSqlTable = ->
      showSQLTableCM thisView
      return
    ), thisView
    thisView.getHeader().el.on "dblclick", (_doShowTableAliasEdit = ->
      showTableAliasEditForm thisView
      return
    ), thisView
    thisView.getHeader().origValue = ""
    
    # register method thisView.moveWindow for the mousemove event on the document and bind to thisView scope
    Ext.EventManager.on document, "mousemove", (_doMoveWindow = ->
      moveWindow thisView
      return
    ), thisView
    
    # register a function for the mouseup event on the document and add the thisView scope
    Ext.EventManager.on document, "mouseup", (->
      
      # save the mousedown state
      thisView.bMouseDown = false
      return
    ), thisView
    return

  showSQLTableCM = (thisView, event, el) ->
    cm = undefined
    
    # stop the browsers event bubbling
    event.stopEvent()
    
    # create context menu
    cm = Ext.create("Ext.menu.Menu",
      items: [
        {
          text: "Add/Edit Alias"
          icon: "resources/images/document_edit16x16.gif"
          handler: Ext.Function.bind(->
            showTableAliasEditForm this
            return
          , this)
        }
        {
          text: "Remove Table"
          icon: "resources/images/delete.gif"
          handler: Ext.Function.bind(->
            
            # remove the qbSqlWindowTable
            @close()
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

  showTableAliasEditForm = (thisView, event, el) ->
    table = undefined
    header = undefined
    title = undefined
    titleId = undefined
    table = OJ.actions.sql.manager.select.tables.getTableById(thisView.tableId)
    header = thisView.getHeader()
    titleId = "#" + header.getId() + "_hd"
    title = thisView.down(titleId)
    header.remove title
    header.insert 0, [
      {
        xtype: "textfield"
        flex: 0.95
        parentCmp: header
        parentTableModel: table
        initComponent: ->
          @setValue table.get("tableAlias")
          @on "render", ((field, event) ->
            
            # set focus to the textfield Benutzerkennung
            field.focus true, 200
            return
          ), this
          @on "specialkey", ((field, event) ->
            if event.getKey() is event.ENTER
              unless field.getValue() is @parentCmp.origValue
                @parentTableModel.set "tableAlias", field.getValue()
                @parentCmp.origValue = field.getValue()
              @removeTextField()
              @addTitle()
            return
          ), this
          @on "blur", ((field, event) ->
            unless field.getValue() is @parentCmp.origValue
              @parentTableModel.set "tableAlias", field.getValue()
              @parentCmp.origValue = field.getValue()
            @removeTextField()
            @addTitle()
            return
          ), this
          @callParent arguments_
          return

        removeTextField: ->
          next = undefined
          next = @next()
          @parentCmp.remove next
          @parentCmp.remove this
          return

        addTitle: ->
          titleText = undefined
          unless @parentTableModel.get("tableAlias") is ""
            titleText = @parentTableModel.get("tableAlias") + " ( " + @parentTableModel.get("tableName") + " )"
          else
            titleText = @parentTableModel.get("tableName")
          @parentCmp.insert 0,
            xtype: "component"
            ariaRole: "heading"
            focusable: false
            noWrap: true
            flex: 1
            id: @parentCmp.id + "_hd"
            style: "text-align:" + @parentCmp.titleAlign
            cls: @parentCmp.baseCls + "-text-container"
            renderTpl: @parentCmp.getTpl("headingTpl")
            renderData:
              title: titleText
              cls: @parentCmp.baseCls
              ui: @parentCmp.ui

            childEls: ["textEl"]

          return
      }
      {
        xtype: "component"
        flex: 0.05
      }
    ]
    return

  regStartDrag = (thisView) ->
    
    # save the mousedown state
    thisView.bMouseDown = true
    
    # start the drag of the sprite
    thisView.shadowSprite.startDrag thisView.getId()
    return

  moveWindow = (thisView, event, domEl, opt) ->
    relPosMovement = undefined
    
    # check mousedown
    if thisView.bMouseDown
      
      # get relative x and y values (offset)
      relPosMovement = getOffset(thisView, "point")
      
      # move the sprite to the position of the window
      thisView.shadowSprite.onDrag relPosMovement
      
      # check if the sprite has any connections
      if thisView.shadowSprite.bConnections
        
        # also move the associated connections
        i = OJ.actions.sql.manager.connections.length

        while i--
          connection thisView, OJ.actions.sql.manager.connections[i]
    return

  getLeftRightCoordinates = (thisView, obj1, obj2, aBBPos) ->
    bb1 = undefined
    bb2 = undefined
    p = []
    dx = undefined
    leftBoxConnectionPoint = undefined
    rightBoxConnectionPoint = undefined
    dis = undefined
    columHeight = 21
    headerHeight = 46
    LeftRightCoordinates = {}
    
    # Get bounding coordinates for both sprites
    bb1 = obj1.getBBox()
    
    # Y value for the connection points on the left and right side of bb1
    bb1.pY = bb1.y + headerHeight + ((aBBPos[0] - 1) * columHeight) + (columHeight / 2) - obj1.scrollTop
    bb2 = obj2.getBBox()
    
    # Y value for the connection points on the left and right side of bb2
    bb2.pY = bb2.y + headerHeight + ((aBBPos[1] - 1) * columHeight) + (columHeight / 2) - obj2.scrollTop
    
    # Left bounding box
    if bb1.pY > (bb1.y + 4) and bb1.pY < (bb1.y + bb1.height - 4)
      p.push
        x: bb1.x - 1 # Point on the left side of the preview column
        y: bb1.pY

      p.push
        x: bb1.x + bb1.width + 1 # Point on the right side of the preview column
        y: bb1.pY

    else
      if bb1.pY < (bb1.y + 4)
        p.push
          x: bb1.x - 1 # Highest point on the left side
          y: bb1.y + 4

        p.push
          x: bb1.x + bb1.width + 1 # Highest point on the right side
          y: bb1.y + 4

      else
        p.push
          x: bb1.x - 1 # Lowest point on the left side
          y: bb1.y + bb1.height - 4

        p.push
          x: bb1.x + bb1.width + 1 # Lowest point on the right side
          y: bb1.y + bb1.height - 4

    
    # The right bounding box
    if bb2.pY > (bb2.y + 4) and bb2.pY < (bb2.y + bb2.height - 4)
      p.push
        x: bb2.x - 1 # Point on the left side of the preview column
        y: bb2.pY

      p.push
        x: bb2.x + bb2.width + 1 # Point on the right side of the preview column
        y: bb2.pY

    else
      if bb2.pY < (bb2.y + 4)
        p.push
          x: bb2.x - 1 # Highest point on the left side.
          y: bb2.y + 4

        p.push
          x: bb2.x + bb2.width + 1 # Highest point on the right side.
          y: bb2.y + 4

      else
        p.push
          x: bb2.x - 1 # Lowest point on the the left side.
          y: bb2.y + bb2.height - 4

        p.push
          x: bb2.x + bb2.width + 1 # Lowest point on the right side.
          y: bb2.y + bb2.height - 4

    
    # A loop over the points of the first BoundingBox
    i = 0

    while i < 2
      
      # A loop over the points of the second BoundingBox
      j = 2

      while j < 4
        
        # Calculation of the offsets between the four points of both BoundingBoxes
        dx = Math.abs(p[i].x - p[j].x)
        dy = Math.abs(p[i].y - p[j].y)

        
        # bb1 left with bb2 right
        if ((i is 0 and j is 3) and dx < Math.abs(p[1].x - p[2].x)) or ((i is 1 and j is 2) and dx < Math.abs(p[0].x - p[3].x))
          leftBoxConnectionPoint = p[i]
          rightBoxConnectionPoint = p[j]
        j++
      i++
    leftBoxConnectionPoint: leftBoxConnectionPoint
    rightBoxConnectionPoint: rightBoxConnectionPoint

  connection = (thisView, obj1, obj2, line, aBBPos) ->
    LeftRightCoordinates = undefined
    line1 = undefined
    line2 = undefined
    miniLine1 = undefined
    miniLine2 = undefined
    path = undefined
    surface = undefined
    color = (if typeof line is "string" then line else "#000")
    ret = OJ.object()
    if obj1.line and obj1.from and obj1.to and obj1.aBBPos
      line = obj1
      obj1 = line.from
      obj2 = line.to
      aBBPos = line.aBBPos
    
    # set reference to the right surface
    surface = obj1.surface
    
    # get coordinates for the left and right box
    LeftRightCoordinates = getLeftRightCoordinates(this, obj1, obj2, aBBPos)
    
    # check if the LeftBox is still on the left side or not
    if LeftRightCoordinates.leftBoxConnectionPoint.x - LeftRightCoordinates.rightBoxConnectionPoint.x < 0
      line1 = 12
      line2 = 12
    else
      line1 = -12
      line2 = -12
    
    # define the path between the left and the right box
    path = [
      "M"
      LeftRightCoordinates.leftBoxConnectionPoint.x
      LeftRightCoordinates.leftBoxConnectionPoint.y
      "H"
      LeftRightCoordinates.leftBoxConnectionPoint.x + line1
      "L"
      LeftRightCoordinates.rightBoxConnectionPoint.x - line2
      LeftRightCoordinates.rightBoxConnectionPoint.y
      "H"
      LeftRightCoordinates.rightBoxConnectionPoint.x
    ].join(",")
    miniLine1 = [
      "M"
      LeftRightCoordinates.leftBoxConnectionPoint.x
      LeftRightCoordinates.leftBoxConnectionPoint.y
      "H"
      LeftRightCoordinates.leftBoxConnectionPoint.x + line1
    ].join(",")
    miniLine2 = [
      "M"
      LeftRightCoordinates.rightBoxConnectionPoint.x - line2
      LeftRightCoordinates.rightBoxConnectionPoint.y
      "H"
      LeftRightCoordinates.rightBoxConnectionPoint.x
    ].join(",")
    
    #check if it is a new connection or not
    if line and line.line
      
      # old connection, only change path
      line.bgLine and line.bgLine.setAttributes(
        path: path
      , true)
      line.line.setAttributes
        path: path
      , true
      line.miniLine1.setAttributes
        path: miniLine1
      , true
      line.miniLine2.setAttributes
        path: miniLine2
      , true
    else
      
      # new connction, return new connection object
      return (
        line: Ext.create("Ext.draw.Sprite",
          type: "path"
          path: path
          stroke: color
          fill: "none"
          "stroke-width": 1
          surface: surface
        ).show(true)
        miniLine1: Ext.create("Ext.draw.Sprite",
          type: "path"
          path: miniLine1
          stroke: color
          fill: "none"
          "stroke-width": 2
          surface: surface
        ).show(true)
        miniLine2: Ext.create("Ext.draw.Sprite",
          type: "path"
          path: miniLine2
          stroke: color
          fill: "none"
          "stroke-width": 2
          surface: surface
        ).show(true)
        bgLine: Ext.create("Ext.draw.Sprite",
          type: "path"
          path: path
          opacity: 0
          stroke: "#fff"
          fill: "none"
          "stroke-width": 10
          surface: surface
        ).show(true)
        from: obj1
        to: obj2
        aBBPos: aBBPos
        uuid: OJ.createUUID()
      )
    ret

  onInit = (that) ->
    store = undefined
    tableModel = undefined
    that.connectionUUIDs = []
    that.bMouseDown = false
    
    # asign a uuid to the window, this builds relationship with qbSqlWindowTable
    that.tableId = OJ.createUUID()
    store = Ext.create("Ext.data.Store",
      autoLoad: true
      fields: [
        {
          name: "id"
          type: "string"
        }
        {
          name: "tableName"
          type: "string"
        }
        {
          name: "tableId"
          type: "string"
          defaultValue: that.tableId
        }
        {
          name: "field"
          type: "string"
        }
        {
          name: "extCmpId"
          type: "string"
          defaultValue: that.id
        }
        {
          name: "type"
          type: "string"
        }
        {
          name: "null"
          type: "string"
        }
        {
          name: "key"
          type: "string"
        }
        {
          name: "default"
          type: "string"
        }
        {
          name: "extra"
          type: "string"
        }
      ]
      proxy:
        type: "memory"
        reader:
          type: "json"
          root: "items"

      data:
        items: [
          {
            field: "*"
            extra: ""
            id: "D04A39CB-AF22-A5F3-0246BA11FD51BCD8"
            key: ""
            tableName: "library"
            null: ""
            default: ""
            type: ""
          }
          {
            field: that.title + "id"
            extra: "auto_increment"
            id: OJ.createUUID()
            key: "PRI"
            tableName: that.title
            null: false
            default: ""
            type: "int(11)"
          }
          {
            field: Faker.Company.catchPhrase().replace(" ", "_").replace("-", "_")
            extra: ""
            id: OJ.createUUID()
            key: ""
            tableName: that.title
            null: true
            default: ""
            type: "datetime"
          }
          {
            field: Faker.Lorem.words()[0]
            extra: ""
            id: OJ.createUUID()
            key: "MUL"
            tableName: that.title
            null: true
            default: ""
            type: "varchar(255)"
          }
        ]
    )
    
    # add sql table to OJ.actions.sql.manager.sqlSelect tables store
    # also asign same id as stores uuid
    tableModel = new OJ.actions.querybuilder.SqlTableNameModel(
      id: that.tableId
      tableName: that.title
      tableAlias: ""
    )
    OJ.actions.sql.manager.select.tables.addTable tableModel
    that.items = [
      xtype: "qbTableGrid"
      store: store
    ]
    return

  sheet = OJ.sheets.sheet(
    name: "Ext." + OJ.name + ".qbSqlWindowTable"
    alias: ["widget.qbSqlWindowTable"]
    onInit: onInit
  )
  sheet.addProp "minWidth", 120
  sheet.addProp "height", 180
  sheet.addProp "width", 140
  sheet.addProp "closable", true
  sheet.addProp "connection", connection
  sheet.addProp "shadowSprite", {}
  sheet.addProp "layout",
    type: "fit"

  sheet.subscribers.add OJ.sheets.constants.subscribers.show, (thisView, eOpts) ->
    initSQLTable thisView
    return

  sheet.subscribers.add OJ.sheets.constants.subscribers.beforeshow, (thisView, eOpts) ->
    aWin = undefined
    prev = undefined
    
    #Cascading window offset
    offeset = 20
    
    #get all instances from xtype qbSqlWindowTable
    aWin = Ext.ComponentQuery.query("qbSqlWindowTable")
    
    #start position if there is only one table
    if aWin.length is 1
      thisView.x = offeset
      thisView.y = offeset
    else
      
      #loop through all instances from xtype qbSqlWindowTable
      i = 0
      l = aWin.length

      while i < l
        if aWin[i] is thisView
          if prev
            thisView.x = prev.x + offeset
            thisView.y = prev.y + offeset
        prev = aWin[i]  if aWin[i].isVisible()
        i++
    thisView.setPosition thisView.x, thisView.y
    return

  sheet.subscribers.add OJ.sheets.constants.subscribers.beforeclose, (thisView, eOpts) ->
    closeSQLTable thisView
    return

  sheet.init()
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
