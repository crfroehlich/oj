# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_renderIIFE = (OJ) ->
  
  ###
  Create a new render subscriber;
  ###
  OJ.selections.subscribers.register "deselect", subscribers = (callBack) ->
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.selection.CheckboxModel-event-deselect
      
      ###
      Event on deselection
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
