((OJ) ->
  module 'span', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    OJ.nodes.div()
  
  test 'Test the Span node', ->
    expect 7
    node = OJ.body.span()
    node.text 'Hi I\'m some text'
    
    # Test 1: tagName is span
    deepEqual node.tagName is 'span', true, 'Node is a span'
    
    nodeId = node.getId() 
    dNode = document.getElementById nodeId
    # Test 2: node is in the DOM
    ok dNode, 'Node is in the DOM' 
    
    # Test 3: IDs are equal
    deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
    # Test 4: chaining works
    child = node.span()
    childId = child.getId()
    deepEqual child.tagName is 'span', true, 'Node is a span'
    
    # Test 5: chained node is in the DOM
    cNode = document.getElementById childId
    deepEqual cNode.id, childId, 'Element IDs are equal'
    
    node.remove()
    equal `undefined`, document.getElementById(nodeId), 'Node has been removed'
    equal `undefined`, document.getElementById(childId), 'Child has been removed'
    return

  return
 
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
