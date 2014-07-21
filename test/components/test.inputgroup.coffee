OJ = require 'ojs'
QUnit.module 'x-input-group', setup: ->
  OJ['GENERATE_UNIQUE_IDS'] = true


QUnit.test 'Test the inputgroup component', ->
  expect 4

  inputgroup = OJ.body.make 'inputgroup'


  # Test 1: componentName is inputgroup
  deepEqual inputgroup.componentName is 'x-input-group', true, 'Component is an inputgroup'

  nodeId = inputgroup.getId()
  dNode = document.getElementById nodeId
  # Test 2: node is in the DOM
  ok dNode, 'Node is in the DOM'

  # Test 3: IDs are equal
  deepEqual nodeId, dNode.id, 'Element IDs are equal'

  inputgroup.remove()
  # Test 4: node is removed
  equal `undefined`, document.getElementById nodeId, 'inputgroup has been removed'

  