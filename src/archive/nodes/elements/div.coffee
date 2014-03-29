#global OJ:true
((OJ) ->
  Div = OJ.Class("Div", OJ.metadata.Node, (parentNode, options) ->
    div = OJ.elements._element(parentNode, "div", options)
    div
  )
  OJ.metadata.register "Div", Div
  OJ.elements.register "div", (parentNode, options) ->
    div = new Div(parentNode, options)
    div

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
