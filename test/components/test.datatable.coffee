do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  module 'x-datatable', setup: ->
    OJ['GENERATE_UNIQUE_IDS'] = true
    
  
  test 'Test the datatable component', ->
    expect 4
    
    datatable = OJ.body.make 'datatable', { 
      opts:
        data: [
          [
            "Tiger Nixon",
            "System Architect",
            "Edinburgh",
            "5421",
            "2011/04/25",
            "$3,120"
          ]
          [
            "Garrett Winters",
            "Director",
            "Edinburgh",
            "8422",
            "2011/07/25",
            "$5,300"
          ]
        ]
        columns: [{title: 'A'},{title: 'B'},{title: 'C'},{title: 'D'},{title: 'E'},{title: 'F'}] 
    }
    
    
    # Test 1: componentName is datatable
    deepEqual datatable.componentName is 'x-datatable', true, 'Component is an datatable'
    
    nodeId = datatable.getId() 
    dNode = document.getElementById nodeId
    # Test 2: node is in the DOM
    ok dNode, 'Node is in the DOM'  
    
    # Test 3: IDs are equal
    deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
    datatable.remove()
    # Test 4: node is removed
    equal `undefined`, document.getElementById nodeId, 'datatable has been removed'
    
    return
 
  return
 

