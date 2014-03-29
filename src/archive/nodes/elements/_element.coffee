#global OJ:true
((OJ) ->
  
  ###
  Elements base class. This will instance a new node from metadata, returning an object that can be consumed
  ###
  _Element = OJ.Class("_Element", OJ.metadata.Node, (elementName) ->
    element = this
    element.nodeName = elementName.toUpperCase()
    element
  )
  OJ.metadata.register "_Element", _Element
  OJ.elements.register "_element", (parentNode, elementName, options) ->
    val = (options.display or options.value or "")
    html = "<" + elementName + " id=\"" + options.id + "\" value=\"" + val + "\""
    if elementName isnt "input"
      html += "\">" + val + "</" + elementName + ">"
    else
      html += "/>"
    vendorHtml = OJ.to.vendorDomObjFromString(html)
    element = new _Element(options.id, vendorHtml[0], vendorHtml)
    
    #Insert the new element into the DOM, directly upon the parent node from which it was called
    parentNode.addChild element
    
    #element.data(options);
    element.addClass options.cssclass
    element.css options.styles
    element.attr options.attr
    element.prop options.prop
    element.on "change", ->

    Object.defineProperty element, "nsVal",
      get: ->
        options.value

      set: (val) ->
        options.value = val
        val

    Object.defineProperty element, "val",
      value: ->
        element[0].getAttribute "value"

    element

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
