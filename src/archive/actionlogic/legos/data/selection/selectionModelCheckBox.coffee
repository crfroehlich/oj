#../release/nsApp-vsdoc.js" />
###
jshint undef: true, unused: true
###

###
global OJ:true, window:true, Ext:true, $: true
###
(_selectionModelClassIIFE = (OJ) ->
  
  ###
  Internal class to define a CheckBox Selection Mode. This class cannot be directly instanced.
  @param name {String} A name for the store class
  @param mode {String} [mode=SIMPLE] The selection mode (SIMPLE; SINGLE; MULTI)
  @param onDefine {Function} [onDefine] An optional callback on init
  ###
  CheckBoxSelectionModel = (name, mode, checkOnly, onDefine) ->
    throw new Error("Selection models do not support mode \"" + mode + "\".")  unless OJ.selections.constants.selectionMode.has(mode)
    that = OJ.selections.selectionModel(
      name: name
      mode: mode
      onDefine: (classDef) ->
        delete classDef.initComponent

        OJ.property classDef, "checkOnly", checkOnly
        onDefine classDef, that  if onDefine
        return
    )
    
    #return window.Ext.create('Ext.selection.CheckboxModel', classDef);
    that

  OJ.instanceOf.register "CheckBoxSelectionModel", CheckBoxSelectionModel
  
  ###
  Instance a new Selection Model. Selection Models are the constraints upon which elements from grids can be selected.
  @param selDef {Object} Object describing the model
  ###
  OJ.selections.register "selectionModelCheckBox", (selDef) ->
    throw new Error("Cannot create a selection model without a definition.")  unless selDef
    selDef.mode = selDef.mode or OJ.selections.constants.selectionMode.simple
    ret = new CheckBoxSelectionModel(selDef.name, selDef.mode, selDef.checkOnly, selDef.onDefine)
    ret.init()
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
