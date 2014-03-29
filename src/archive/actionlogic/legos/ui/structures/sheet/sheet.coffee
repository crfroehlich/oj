# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_treelIIFE = (OJ) ->
  
  ###
  Define the properties which are available to Grid.
  ###
  sheetProperties = OJ.object()
  sheetProperties.add "minWidth", "minWidth"
  sheetProperties.add "cascadeOnFirstShow", "cascadeOnFirstShow"
  sheetProperties.add "height", "height"
  sheetProperties.add "width", "width"
  sheetProperties.add "shadowSprite", "shadowSprite"
  sheetProperties.add "layout", "layout"
  sheetProperties.add "closable", "closable"
  sheetProperties.add "connection", "connection"
  sheetProperties.add "items", "items"
  sheetProperties.add "title", "title"
  OJ.constant OJ.sheets, "properties", sheetProperties
  
  ###
  Private class representing the construnction of a window (sheet). It returns a OJ.sheets.sheet instance with collections for adding subscribers.
  @param name {String} The ClassName of the window (sheet) to associate with ExtJS
  @param requires {Array} An array of ExtJS dependencies
  @param extend {String} [extend='Ext.window.Window'] An ExtJs class name to extend, usually the window Window
  @param alias {Array} [alias] An array of aliases to reference the window (sheet)
  @param id {String} An id to uniquely identify the window (sheet)
  @param store {OJ.stores.store} A store to provide data to the window (sheet)
  @param plugins {Array} An array of plugins to load with the window (sheet)
  @param onInit {Function} [onInit] Optional callback to be applied on construction
  ###
  Sheet = (name, requires, extend, alias, id, store, plugins, onInit) ->
    "use strict"
    that = OJ.classDefinition(
      name: name
      requires: requires
      extend: extend or "Ext.window.Window"
      alias: alias
      id: id
      store: store
      plugins: plugins
      constant: "windowProperties"
      namespace: "sheets"
    )
    if onInit
      that.addInitComponent (them) ->
        onInit them
        return

    that

  OJ.instanceOf.register "Sheet", Sheet
  
  ###
  Create a window (sheet) object.
  @param sheetDef.treeName {String} The ClassName of the window (sheet) to associate with ExtJS
  @param sheetDef.requires {Array} An array of ExtJS dependencies
  @param sheetDef.extend {String} [extend='Ext.window.Window'] An ExtJs class name to extend, usually the window Window
  @param sheetDef.alias {Array} [alias] An array of aliases to reference the window (sheet)
  @param sheetDef.id {String} An id to uniquely identify the window (sheet)
  @param sheetDef.store {OJ.trees.stores.store} A store to provide data to the window (sheet)
  @param sheetDef.plugins {Array} An array of plugins to load with the window (sheet)
  @param sheetDef.onInit {Function} [onInit] Optional callback to be applied on construction
  @returns {OJ.trees.sheet} A sheet object. Exposese subscribers and columns collections. Call init when ready to construct the sheet.
  ###
  OJ.sheets.register "sheet", sheetfunc = (sheetDef) ->
    "use strict"
    throw new Error("Cannot instance a window (sheet) without properties")  unless sheetDef
    throw new Error("Cannot instance a window (sheet) without a classname")  if not (sheetDef.name) and not (sheetDef.id)
    sheet = new Sheet(sheetDef.name, sheetDef.requires, sheetDef.extend, sheetDef.alias, sheetDef.id, sheetDef.store, sheetDef.plugins, sheetDef.onInit)
    sheet

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
