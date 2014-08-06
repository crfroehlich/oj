do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  module 'x-easypie', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    
  
  test 'Test the easypie component', ->
    expect 4
    
    easypie = OJ.body.make 'easypie'
    
    
    # Test 1: componentName is easypie
    deepEqual easypie.componentName is 'x-easypie', true, 'Component is an easypie'
    
    nodeId = easypie.getId() 
    dNode = document.getElementById nodeId
    # Test 2: node is in the DOM
    ok dNode, 'Node is in the DOM' 
    
    # Test 3: IDs are equal
    deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
    easypie.remove()
    # Test 4: node is removed
    equal `undefined`, document.getElementById nodeId, 'easypie has been removed'
    
    return

  return
 

