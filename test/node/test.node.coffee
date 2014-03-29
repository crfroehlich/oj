((OJ) ->
  module OJ.name + "node"
  test OJ.name + ".node.make(" + OJ.name + "'TestingDiv')", ->
    expect 3
    node = OJ.nodes.div()
    deepEqual node.tagName is "DIV", true, OJ.name + " Node is a DIV"
    return

  test OJ.name + " test child node", ->
    expect 3
    node = OJ.nodes.div()
    childDiv = node.div()
    
    return

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
