# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_actionColumnIIFE = (OJ) ->
  
  ###
  Internal action column class
  @param text {String} Name of the column
  ###
  ActionColumn = (text) ->
    "use strict"
    that = OJ.grids.columns.column(
      xtype: OJ.grids.constants.xtypes.actioncolumn
      width: 60
      text: text
    )
    OJ.property that, "items", []
    OJ.property that, "addItem", ((columnItem) ->
      throw new Error("Invalid column item specified for collection.")  unless columnItem instanceof OJ.instanceOf.ColumnItem
      that.items.push columnItem
      that
    ), false, false, false
    that

  OJ.instanceOf.register "ActionColumn", ActionColumn
  
  ###
  Create an action column
  @param sortable {Boolean} [sortable=true] Is Column Sortable
  @param text {String} Column Name
  @param menuDisabled {Boolean} [menuDisabled=false] Is Menu Disabled
  ###
  OJ.grids.columns.register "actionColumn", actionColumn = (sortable, text, menuDisabled) ->
    "use strict"
    throw new Error("Cannot create a column without parameters")  if arguments_.length is 0
    ret = new ActionColumn(text)
    ret.menuDisabled = menuDisabled
    ret.sortable = sortable
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
