#global OJ:true
((OJ) ->
  Input = OJ.Class("Input", OJ.metadata.Node, (NsNode, options) ->
    input = OJ.elements._element(NsNode, "input", options)
    input
  )
  OJ.metadata.register "Input", Input
  OJ.elements.register "input", (NsNode, options) ->
    input = OJ.metadata.Input(NsNode, options)
    input

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
