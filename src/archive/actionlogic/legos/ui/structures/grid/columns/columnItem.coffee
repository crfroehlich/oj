# global OJ:true, window:true, Ext:true 
(_columnItemIIFE = (OJ) ->
  
  ###
  Private column item class constructor
  @param icon {String} Relative path to icon file
  @param tooltip {String} Tooltip to display on hover
  @param onGetClass {Function} [onGetClass] Method to call when getClass is called
  @param onHandler {Function} Method to fire in response to action column click
  ###
  ColumnItem = (icon, tooltip, onGetClass, onHandler) ->
    "use strict"
    that = this
    OJ.property that, "icon", icon
    OJ.property that, "tooltip", tooltip
    
    ###
    Get the CSS class for the supplied values
    ###
    OJ.property that, "getClass", getClass = (value, metadata, record) ->
      store = undefined
      index = undefined
      ret = "x-grid-center-icon"
      store = record.store
      index = store.indexOf(record)
      ret = "x-action-icon-disabled"  if onGetClass and onGetClass(index, store)
      ret

    
    ###
    Generic handler
    ###
    OJ.property that, "handler", handler = (grid, rowIndex, colIndex) ->
      if onHandler
        args = OJ.getArguments(arguments_)
        onHandler.apply this, args
      return

    that

  OJ.instanceOf.register "ColumnItem", ColumnItem
  
  ###
  Create a column item, usually for inclusion in an ActionColumn
  @param icon {String} Relative path to icon file
  @param tooltip {String} Tooltip to display on hover
  @param onGetClass {Function} [onGetClass] Method to call when getClass is called
  @param onHandler {Function} Method to fire in response to action column click
  ###
  OJ.grids.columns.register "columnItem", columnItem = (icon, tooltip, onGetClass, onHandler) ->
    "use strict"
    throw new Error("Cannot create a column item without parameters")  if arguments_.length is 0 or not onHandler
    icon = icon or ""
    tooltip = tooltip or ""
    onGetClass = onGetClass or ->

    ret = new ColumnItem(icon, tooltip, onGetClass, onHandler)
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
