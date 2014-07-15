do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  module 'div', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    
    
  test 'Test the Div node', ->
    expect 7
    node = OJ.body.make('div')
    node.text 'Hi I\'m some text'
    
    # Test 1: tagName is div
    deepEqual node.tagName is 'div', true, 'Node is a DIV'
    
    nodeId = node.getId() 
    dNode = document.getElementById nodeId
    # Test 2: node is in the DOM
    ok dNode, 'Node is in the DOM' 
    
    # Test 3: IDs are equal
    deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
    # Test 4: chaining works
    child = node.make('div')
    childId = child.getId()
    deepEqual child.tagName is 'div', true, 'Node is a DIV'
    
    # Test 5: chained node is in the DOM
    cNode = document.getElementById childId
    deepEqual cNode.id, childId, 'Element IDs are equal'
    
    node.remove()
    # Test 6: node is removed
    equal `undefined`, document.getElementById(nodeId), 'Node has been removed'
    
    # Test 7: child is removed
    equal `undefined`, document.getElementById(childId), 'Child has been removed'
    
    return

  return
 

