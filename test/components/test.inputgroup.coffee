qunit = require 'qunit'

qunit.module 'x-input-group', setup: ->
  OJ['GENERATE_UNIQUE_IDS'] = true
    
  
qunit.test 'Test the inputgroup component', ->
  qunit.expect 4
    
  inputgroup = OJ.body.make 'inputgroup'
    
    
  # Test 1: componentName is inputgroup
  qunit.deepEqual inputgroup.componentName is 'x-input-group', true, 'Component is an inputgroup'
    
  nodeId = inputgroup.getId() 
  dNode = document.getElementById nodeId
  # Test 2: node is in the DOM
  qunit.ok dNode, 'Node is in the DOM' 
    
  # Test 3: IDs are equal
  qunit.deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
  inputgroup.remove()
  # Test 4: node is removed
  qunit.equal `undefined`, document.getElementById nodeId, 'inputgroup has been removed'