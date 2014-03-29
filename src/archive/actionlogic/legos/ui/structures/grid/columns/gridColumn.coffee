# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_gridColumnIIFE = (OJ) ->
  
  ###
  Private grid column class constructor
  @param text {String} Column Name
  @param editor {String} If column is editable, the type of editor
  @param flex {Number} [flex=0.125] Relative width of the column
  ###
  GridColumn = (text, editor, flex) ->
    "use strict"
    that = OJ.grids.columns.column(
      xtype: OJ.grids.constants.xtypes.gridcolumn
      flex: flex or 0.125
      editor: editor
      text: text
    )
    that

  OJ.instanceOf.register "GridColumn", GridColumn
  
  ###
  Create a grid column
  @param sortable {Boolean} [sortable=true] Is Column Sortable
  @param text {String} Column Name
  @param menuDisabled {Boolean} [menuDisabled=false] Is Menu Disabled
  @param flex {Number} [flex=0.125] Relative width of the column
  @param editor {String} If column is editable, the type of editor
  ###
  OJ.grids.columns.register "gridColumn", gridColumn = (sortable, text, menuDisabled, flex, editor) ->
    "use strict"
    throw new Error("Cannot create a column without parameters")  if arguments_.length is 0
    ret = new GridColumn(text, editor, flex)
    ret.menuDisabled = menuDisabled
    ret.sortable = sortable
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
