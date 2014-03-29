# global window:true, Ext:true 

#
# * Responsible for rendering the final SQL output
#
((OJ) ->
  initOutputPanel = (panelDef) ->
    
    #
    #         * Define a panel
    #        
    panel = OJ.panels.panel(
      name: "Ext." + OJ.name + ".qbOutputPanel"
      alias: ["widget.qbOutputPanel"]
      id: "qbOutputPanel"
    )
    panel.subscribers.add OJ.panels.constants.subscribers.afterlayout, ->
      window.SyntaxHighlighter.highlight()
      return

    panel.init()
    xtype: "qbOutputPanel"
    border: false
    region: "center"
    autoScroll: true
    html: "<pre class=\"brush: sql\">SQL Output Window</pre>"
    margin: 5
    height: 150
    split: true

  OJ.actions.querybuilder.register "qbOutputPanel", initOutputPanel
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
