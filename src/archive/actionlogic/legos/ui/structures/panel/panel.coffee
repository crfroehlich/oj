# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_panelIIFE = (OJ) ->
  
  ###
  Define the properties which are available to Panel.
  ###
  panelProperties = Object.create(null)
  panelProperties.items = "items"
  OJ.constant OJ.panels, "properties", panelProperties
  
  ###
  Private class representing the construnction of a panel. It returns a OJ.panel.panel instance with collections for adding columns and subscribers.
  @param name {String} The ClassName of the panel to associate with ExtJS
  @param requires {Array} An array of ExtJS dependencies
  @param extend {String} [extend='Ext.panel.Panel'] An ExtJs class name to extend, usually the panel panel
  @param alias {Array} [alias] An array of aliases to reference the panel
  @param id {String} An id to uniquely identify the panel
  @param store {OJ.panels.stores.store} A store to provide data to the panel
  @param plugins {Array} An array of plugins to load with the panel
  ###
  Panel = (name, requires, extend, alias, id, store, plugins) ->
    "use strict"
    that = OJ.classDefinition(
      name: name
      requires: requires
      extend: extend or "Ext.panel.Panel"
      alias: alias
      id: id
      store: store
      plugins: plugins
      namespace: "panels"
    )
    that

  OJ.instanceOf.register "Panel", Panel
  
  ###
  Create a panel object.
  @returns {OJ.panels.panel} A panel object. Exposese subscribers and columns collections. Call init when ready to construct the panel.
  ###
  OJ.panels.register "panel", panelFunc = (panelDef) ->
    "use strict"
    throw new Error("Cannot instance a panel without properties")  unless panelDef
    throw new Error("Cannot instance a panel without a classname")  if not (panelDef.name) and not (panelDef.id)
    panel = new Panel(panelDef.name, panelDef.requires, panelDef.extend, panelDef.alias, panelDef.id, panelDef.store, panelDef.plugins)
    panel

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
