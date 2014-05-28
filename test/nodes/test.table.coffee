((OJ) ->
  module 'table', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    if not OJ.body.make then OJ.nodes.div()
  
  test 'Test the Table node', ->
    expect 25
    node = OJ.body.make 'table'
    
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
    equal `undefined`, document.getElementById(nodeId), 'Node has been removed'
    equal `undefined`, document.getElementById(childId), 'Child has been removed'
    return

  return
 
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
