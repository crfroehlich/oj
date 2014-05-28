((OJ) ->
  module 'grid', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    if not OJ.body.make then OJ.nodes.div()
  
  test 'Test the grid component', ->
    expect 4
    
    grid = OJ.body.make 'grid'
    
    # Test 1: componentName is grid
    deepEqual grid.componentName is 'x-grid', true, 'Component is a grid'
    
    nodeId = grid.getId() 
    dNode = document.getElementById nodeId
    # Test 2: node is in the DOM
    ok dNode, 'Node is in the DOM' 
    
    # Test 3: IDs are equal
    deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
    grid.remove()
    # Test 4: node is removed
    equal `undefined`, document.getElementById nodeId, 'grid has been removed'
    
    return
    
  test 'Test the tiles component', ->
    expect 31
    
    grid = OJ.body.make 'grid'
    nodeId = grid.getId()
    
    i = 0
    while i < 10
      tile = grid.tile Faker.random.number(99), Faker.random.number(3)
      childId = tile.getId()
      
      # Test 1*10: node is a component
      deepEqual tile.componentName is "x-tile", true, "Component is a tile"
      
      # Test 2*10: chained node is in the DOM
      cNode = document.getElementById childId
      deepEqual cNode.id, childId, 'Element IDs are equal'
      
      # Test 3*10: chained node is chainable
      nuDiv = tile.make('div')
      nuDivId = nuDiv.getId()
      nuNode = document.getElementById nuDivId
      deepEqual nuNode.id, nuDivId, 'Element IDs are equal'
      
      i += 1
    
    grid.remove()
    # Test 4: node is removed
    equal `undefined`, document.getElementById nodeId, 'grid has been removed'
    
    return

  

  return
 
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
