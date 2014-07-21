OJ = require 'ojs'
QUnit.module 'x-flotchart', setup: ->
  OJ['GENERATE_UNIQUE_IDS'] = true


QUnit.test 'Test the flotchart component', ->
  expect 4

  flotchart = OJ.body.make 'flotchart'


  # Test 1: componentName is flotchart
  deepEqual flotchart.componentName is 'x-flotchart', true, 'Component is an flotchart'

  nodeId = flotchart.getId()
  dNode = document.getElementById nodeId
  # Test 2: node is in the DOM
  ok dNode, 'Node is in the DOM'

  # Test 3: IDs are equal
  deepEqual nodeId, dNode.id, 'Element IDs are equal'

  flotchart.remove()
  # Test 4: node is removed
  equal `undefined`, document.getElementById nodeId, 'flotchart has been removed'

