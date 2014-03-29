# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_dropIIFE = (OJ) ->
  
  ###
  Create a new render subscriber;
  ###
  OJ.selections.subscribers.register "select", subscribers = (callBack) ->
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.selection.CheckboxModel-event-select
      
      ###
      Event on selection
      @param thisRow {Ext.selection.RowModel} the row model
      @param dataModel {Ext.data.Model} the data model
      @param index {Number} the row index
      @param eOpts {Object} arbitrary Ext props
      ###
      render = (thisRow, dataModel, rowIndex, eOpts) ->
        callBack thisRow, dataModel, rowIndex, eOpts
        return

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
