# global window:true, Ext:true 
((OJ) ->
  initTablePanel = (tableDef) ->
    panel = OJ.panels.panel(id: "qbTablePanel")
    initDropTarget = (thisPanel) ->
      
      # init draw component inside qbwindow as a DropTarget
      thisPanel.dropTarget = Ext.create("Ext.dd.DropTarget", thisPanel.el,
        ddGroup: "sqlDDGroup"
        notifyDrop: (source, event, data) ->
          qbTablePanel = undefined
          
          # add a qbSqlWindowTable to the qbTablePanel component
          qbTablePanel = Ext.getCmp("qbTablePanel")
          qbTablePanel.add(
            xtype: "qbSqlWindowTable"
            constrain: true
            title: data.records[0].get("text")
          ).show()
          true
      )
      return

    panel.addProp "items", [
      xtype: "draw"
      listeners:
        afterrender: ->
          thisPanel = this
          initDropTarget thisPanel
          return
    ]
    panel.init()
    xtype: "qbTablePanel"
    border: false
    region: "center"
    height: 280
    split: true
    layout: "fit"

  OJ.actions.querybuilder.register "qbTablePanel", initTablePanel
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
