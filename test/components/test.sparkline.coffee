OJ = require 'ojs'
QUnit.module 'x-sparkline', setup: ->
  OJ['GENERATE_UNIQUE_IDS'] = true


QUnit.test 'Test the sparkline component', ->
  expect 4

  sparkline = OJ.body.make 'sparkline'


  # Test 1: componentName is sparkline
  deepEqual sparkline.componentName is 'x-sparkline', true, 'Component is an sparkline'

  nodeId = sparkline.getId()
  dNode = document.getElementById nodeId
  # Test 2: node is in the DOM
  ok dNode, 'Node is in the DOM'

  # Test 3: IDs are equal
  deepEqual nodeId, dNode.id, 'Element IDs are equal'

  sparkline.remove()
  # Test 4: node is removed
  equal `undefined`, document.getElementById nodeId, 'sparkline has been removed'

  