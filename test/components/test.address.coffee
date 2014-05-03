((OJ) ->
  module 'x-address', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    OJ.nodes.div()
  
  test 'Test the address component', ->
    expect 4
    
    address = OJ.body.address()
    
    
    # Test 1: componentName is address
    deepEqual address.componentName is 'x-address', true, 'Component is an address'
    
    nodeId = address.getId() 
    dNode = document.getElementById nodeId
    # Test 2: node is in the DOM
    ok dNode, 'Node is in the DOM'  
    
    # Test 3: IDs are equal
    deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
    address.remove()
    # Test 4: node is removed
    equal `undefined`, document.getElementById nodeId, 'Address has been removed'
    
    return
 
  return
 
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
