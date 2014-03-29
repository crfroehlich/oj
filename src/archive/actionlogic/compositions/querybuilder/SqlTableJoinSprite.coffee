#jshint undef: true, unused: true 

#global OJ:true, window:true, Ext:true, $: true 
((OJ) ->
  startDrag = (id) ->
    me = this
    win = undefined
    qbTablePanel = undefined
    xyParentPos = undefined
    xyChildPos = undefined
    
    # get a reference to a qbSqlWindowTable
    win = Ext.getCmp(id)
    
    # get the main qbTablePanel
    qbTablePanel = Ext.getCmp("qbTablePanel")
    
    # get the main qbTablePanel position
    xyParentPos = qbTablePanel.el.getXY()
    
    # get the size of the previously added qbSqlWindowTable
    xyChildPos = win.el.getXY()
    me.prev = me.surface.transformToViewBox(xyChildPos[0] - xyParentPos[0] + 2, xyChildPos[1] - xyParentPos[1] + 2)
    return

  onDrag = (relPosMovement) ->
    me = this
    newX = undefined
    newY = undefined
    
    # move the sprite
    # calculate new x and y position
    newX = me.prev[0] + relPosMovement[0]
    newY = me.prev[1] + relPosMovement[1]
    
    # set new x and y position and redraw sprite
    me.setAttributes
      x: newX
      y: newY
    , true
    return

  spriteDef = OJ.classDefinition(
    name: "Ext." + OJ.name + ".SqlTableJoinSprite"
    extend: "Ext.draw.Sprite"
    alias: ["widget.SqlTableJoinSprite"]
    onDefine: (classDef) ->
      OJ.property classDef, "bConnections", false
      OJ.property classDef, "startDrag", startDrag
      OJ.property classDef, "onDrag", onDrag
      return
  )
  sprite = spriteDef.init()
  OJ.actions.querybuilder.register "SqlTableJoinSprite", sprite
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
