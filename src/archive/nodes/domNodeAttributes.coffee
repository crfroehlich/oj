#global OJ:true
((OJ) ->
  optionsProto = ->
    
    #OJ.property(obj, name, val, writable, configurable, enumerable);
    OJ.property this, "accesskey", null, false, true
    OJ.property this, "class", null, false, true
    OJ.property this, "contenteditable", null, false, true
    OJ.property this, "contextmenu", null, false, true
    OJ.property this, "draggable", null, false, true
    OJ.property this, "dropzone", null, false, true
    OJ.property this, "hidden", null, false, true
    OJ.property this, "spellcheck", null, false, true
    OJ.property this, "style", null, false, true
    OJ.property this, "tabindex", null, false, true
    OJ.property this, "title", null, false, true
    this

  OJ.node.register "globalAttributes", (options) ->
    globOpts = OJ.object(optionsProto::)
    ret = globOpts
    if OJ.is.plainObject(options)
      OJ.property options, "globalAttributes", globOpts
      ret = options
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ, ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ["?"]
