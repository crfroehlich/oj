((OJ) ->
  module OJ.name + 'node'
  test OJ.name + '.nodes.div(TestingDiv)', ->
    node = OJ.nodes.div()
    node.text 'Hi I\'m some text'
    deepEqual node.tagName is 'div', true, OJ.name + ' Node is a DIV'
    return

  test OJ.name + ' test child node', ->
    node = OJ.nodes.div()
    node.text 'Hi I\'m some nu text'
    childDiv = node.div()
    childDiv.text 'Hi I\'m some child text'
    deepEqual childDiv.tagName is 'div', true, OJ.name + ' Node is a DIV'
    return

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
