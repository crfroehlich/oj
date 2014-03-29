#../release/nsApp-vsdoc.js" />
# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_selectionModelClassIIFE = (OJ) ->
  
  #Init the OJ
  OJ.makeSubNameSpace "selections"
  selectionMode = OJ.object()
  selectionMode.simple = "SIMPLE"
  selectionMode.single = "SINGLE"
  selectionMode.multi = "MULTI"
  OJ.constant OJ.selections, "selectionMode", selectionMode
  selectionModelProperties = OJ.object()
  selectionModelProperties.allowDeselect = "allowDeselect"
  selectionModelProperties.mode = "mode"
  selectionModelProperties.pruneRemoved = "pruneRemoved"
  OJ.constant OJ.selections, "properties", selectionModelProperties
  
  ###
  Internal class to define a Selection Mode. This class cannot be directly instanced.
  @param name {String} A name for the store class
  @param extend {String} [extend=Ext.selection.Model] The Ext extension to use
  @param mode {String} [mode=SIMPLE] The selection mode (SIMPLE; SINGLE; MULTI)
  @param onDefine {Function} [onDefine] An optional callba
  ###
  SelectionModel = (name, extend, mode, onDefine) ->
    throw new Error("Grid selection model does not support mode \"" + mode + "\".")  unless OJ.selections.constants.selectionMode.has(mode)
    that = OJ.classDefinition(
      name: name
      namespace: "selections"
      onDefine: (classDef) ->
        delete classDef.initComponent

        OJ.property classDef, "mode", mode
        onDefine classDef  if onDefine
        return
    )
    that

  OJ.instanceOf.register "SelectionModel", SelectionModel
  
  ###
  Instance a new Selection Model. Selection Models are the constraints upon which elements from grids can be selected.
  @param selDef {Object} Object describing the model
  @param selDef.name {String} A name for the store class
  @param selDef.extend {String} [extend=Ext.selection.Model] The Ext extension to use
  @param selDef.mode {String} [mode=SIMPLE] The selection mode (SIMPLE; SINGLE; MULTI)
  @param selDef.onDefine {Function} [onDefine] An optional callba
  ###
  OJ.selections.register "selectionModel", (selDef) ->
    throw new Error("Cannot create a selection model without a definition.")  unless selDef
    selDef.mode = selDef.mode or OJ.grids.constants.selectionMode.simple
    ret = new SelectionModel(selDef.name, selDef.extend, selDef.mode, selDef.onDefine)
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
