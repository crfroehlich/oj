# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_checkColumnIIFE = (OJ) ->
  
  ###
  Internal check column class
  @param text {String} Name of the column
  ###
  CheckColumn = (text) ->
    "use strict"
    that = OJ.grids.columns.column(
      xtype: OJ.grids.constants.xtypes.checkcolumn
      flex: 0.075
      text: text
    )
    that.align = "center"
    that

  OJ.instanceOf.register "CheckColumn", CheckColumn
  
  ###
  Create a check column
  @param sortable {Boolean} [sortable=true] Is Column Sortable
  @param text {String} Column Name
  @param menuDisabled {Boolean} [menuDisabled=false] Is Menu Disabled
  ###
  OJ.grids.columns.register "checkColumn", checkColumn = (sortable, text, menuDisabled) ->
    "use strict"
    throw new Error("Cannot create a column without parameters")  if arguments_.length is 0
    ret = new CheckColumn(text)
    ret.menuDisabled = menuDisabled
    ret.sortable = sortable
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
