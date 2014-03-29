#global OJ:true
((OJ) ->
  Span = OJ.Class("Span", OJ.metadata.Node, ->
    span = this
    span.nodeName = "SPAN"
    span
  )
  OJ.metadata.register "Span", Span
  OJ.elements.register "span", (NsNode, options) ->
    html = "<span id=\"" + options.id + "\" value=\"" + options.value + "\">" + options.display or options.value + "</span>"
    vendorHtml = OJ.to.vendorDomObjFromString(html)
    span = new OJ.metadata.Span(options.id, vendorHtml[0], vendorHtml)
    NsNode.addChild span
    span.addClass options.cssclass
    span.css options.styles
    span.attr options.attr
    span.prop options.prop
    Object.defineProperty span, "nsVal",
      get: ->
        options.value

      set: (val) ->
        options.value = val
        val

    Object.defineProperty span, "val",
      value: ->
        span[0].getAttribute "value"

    span

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
