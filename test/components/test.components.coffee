((OJ) ->
  module 'components', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    OJ.nodes.div()
  
  test 'Test the address component', ->
    expect 4
    
    address = OJ.body.address()
    
    
    # Test 1: tagName is div
    deepEqual address.tagName is 'x-address', true, 'Component is an address'
    
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
    
  test 'Test the price component', ->
    expect 4
    
    price = OJ.body.price()
    
    
    # Test 1: tagName is div
    deepEqual price.tagName is 'x-price', true, 'Component is a price'
    
    nodeId = price.getId() 
    dNode = document.getElementById nodeId
    # Test 2: node is in the DOM
    ok dNode, 'Node is in the DOM' 
    
    # Test 3: IDs are equal
    deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
    price.remove()
    # Test 4: node is removed
    equal `undefined`, document.getElementById nodeId, 'Price has been removed'
    
    return

  

  return
 
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
