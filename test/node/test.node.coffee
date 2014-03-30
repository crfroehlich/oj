((OJ) ->
  module OJ.name + 'nodes'
  test 'Test the Div node', ->
    expect 7
    node = OJ.nodes.div()
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
    child = node.div()
    childId = child.getId()
    deepEqual child.tagName is 'div', true, 'Node is a DIV'
    
    # Test 5: chained node is in the DOM
    cNode = document.getElementById childId
    deepEqual cNode.id, childId, 'Element IDs are equal'
    
    node.remove()
    # Test 6: node is removed
    equal `undefined`, document.getElementById nodeId, 'Node has been removed'
    
    # Test 7: child is removed
    equal `undefined`, document.getElementById childId, 'Child has been removed'
    
    return

  test 'Test the Span node', ->
    expect 7
    node = OJ.nodes.span()
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
    equal `undefined`, document.getElementById nodeId, 'Node has been removed'
    equal `undefined`, document.getElementById childId, 'Child has been removed'
    return

  test 'Test the Table node', ->
    expect 25
    node = OJ.nodes.table()
    
    # Test 1: tagName is table
    deepEqual node.tagName is 'table', true, 'Node is a table'
    
    nodeId = node.getId() 
    dNode = document.getElementById nodeId
    # Test 2: node is in the DOM
    ok dNode, 'Node is in the DOM' 
    
    # Test 3: IDs are equal
    deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
    # Test 4*10: chaining works
    i = 0
    while i < 10
      child = node.cell Faker.random.number(99), Faker.random.number(99)
      childId = child.getId()
      deepEqual child.tagName is "td", true, "Node is a td"
      # Test 5*10: chained node is in the DOM
      cNode = document.getElementById childId
      deepEqual cNode.id, childId, 'Element IDs are equal'
      i += 1
    
    node.remove()
    equal `undefined`, document.getElementById nodeId, 'Node has been removed'
    equal `undefined`, document.getElementById childId, 'Child has been removed'
    return

  return
 
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
