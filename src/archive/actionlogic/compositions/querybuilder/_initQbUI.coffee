# jshint undef: true, unused: true 

# global Ext  
((OJ) ->
  initQbUI = (qbId) ->
    
    # Init the singleton.  Any tag-based quick tips will start working.
    Ext.tip.QuickTipManager.init()
    
    # create main application namespace $OJ$.sql
    Ext.namespace OJ.name + ".sql"
    
    # On init method
    onInit = (that) ->
      OJ.actions.sql.init()
      
      # disable gutter (linenumbers) and toolbar for SyntaxHighlighter
      window.SyntaxHighlighter.defaults["gutter"] = false
      window.SyntaxHighlighter.defaults["toolbar"] = false
      
      # add toolbar to the dockedItems
      that.dockedItems = [
        xtype: "toolbar"
        dock: "top"
        items: [
          {
            xtype: "tbfill"
          }
          {
            text: "Save"
            icon: "img/icon-save.gif"
          }
          {
            text: "Run"
            icon: "img/run.png"
          }
        ]
      ]
      return

    
    # Define the window
    sheet = OJ.sheets.sheet(
      id: qbId
      onInit: onInit
    )
    sheet.addProp "height", 620
    sheet.addProp "width", 1000
    sheet.addProp "title", "Visual SQL Query Builder"
    sheet.addProp "layout",
      type: "border"

    
    # Define the layout
    items = [
      OJ.actions.querybuilder.qbOutputPanel({})
      {
        xtype: "panel"
        border: false
        height: 400
        margin: 5
        layout:
          type: "border"

        region: "north"
        split: true
        items: [
          OJ.actions.querybuilder.qbTablePanel({})
          OJ.actions.querybuilder.qbFineTuningGrid({})
          OJ.actions.querybuilder.qbTablesTree({})
        ]
      }
    ]
    sheet.addProp "items", items
    sheet.init()
    return

  OJ.actions.querybuilder.register "initQbUI", initQbUI
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
