((OJ) ->
  
  randomXys = []
  xy = 0
  while xy < 10
    randomXys[xy] = 
      x: Faker.random.number(99)
      y: Faker.random.number(3)
    xy += 1
      
  module 'grid', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    
  
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
      tile = grid.tile randomXys[i].x, randomXys[i].y
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

  test 'Test the tiles component using document fragment', ->
    expect 11
    
    fragment = OJ.fragment()
    grid = fragment.make 'grid'
    nodeId = grid.getId()
    
    i = 0
    while i < 10
      tile = grid.tile randomXys[i].x, randomXys[i].y
      
      # Test 1*10: node is a component
      deepEqual tile.componentName is "x-tile", true, "Component is a tile"
      
      # Test 2*10: chained node is in the DOM
      
      # Test 3*10: chained node is chainable
      nuDiv = tile.make('div')
      
      i += 1
    
    div = OJ.body.make 'div'
    div.append grid
    div.remove()
    # Test 4: node is removed
    equal `undefined`, document.getElementById nodeId, 'grid has been removed'
    
    return


  return
 
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
