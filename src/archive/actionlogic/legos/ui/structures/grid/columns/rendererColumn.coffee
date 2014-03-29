# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_gridColumnIIFE = (OJ) ->
  
  ###
  Private renderer column class constructor.
  @param dataIndex {String} Column id
  @param width {Number} [width] Absolute width of the column
  @param flex {Number} [flex] Relative width of the column
  @param onRender {Function} Render method for the column
  ###
  RendererColumn = (dataIndex, width, flex, onRender) ->
    "use strict"
    that = OJ.grids.columns.column(
      xtype: OJ.grids.constants.xtypes.gridcolumn
      dataIndex: dataIndex
    )
    
    #text: dataIndex
    OJ.property that, "renderer", onRender
    if width and width > 0
      OJ.property that, "width", width
    else
      OJ.property that, "flex", flex  if flex and flex > 0
    that

  OJ.instanceOf.register "RendererColumn", RendererColumn
  
  ###
  Create a grid column which renders as the result of a callback
  @param colDef {Object} Definition of the renderer column
  ###
  OJ.grids.columns.register "rendererColumn", rendererColumn = (colDef) ->
    "use strict"
    throw new Error("Cannot create a column without parameters")  if not colDef or arguments_.length is 0
    throw new Error("Cannot create a render column without a render method.")  unless colDef.onRender
    ret = new RendererColumn(colDef.dataIndex, colDef.width, colDef.flex, colDef.onRender)
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
