# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_columnsIIFE = (OJ) ->
  
  #OJ.dependsOn(['OJ.dataModels.field'], function () {
  
  ###
  Defines a collection of columns
  ###
  Columns = ->
    "use strict"
    that = this
    OJ.property that, "value", []
    
    ###
    Add a column to the collection
    ###
    OJ.property that, "add", add = (column) ->
      throw new Error("Only columns can be added to the Columns collection")  unless column instanceof OJ.instanceOf.Column
      that.value.push column
      that

    that

  OJ.instanceOf.register "Columns", Columns
  
  ###
  A mechanism for generating columns
  ###
  OJ.grids.columns.register "columns", columns = ->
    "use strict"
    ret = new Columns()
    ret

  return

#});
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
