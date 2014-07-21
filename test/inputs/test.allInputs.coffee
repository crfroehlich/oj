OJ = require 'ojs'
QUnit.module 'all inputs', setup: ->
  OJ['GENERATE_UNIQUE_IDS'] = true


QUnit.test 'Test all inputs', ->
  count = 0
  OJ.each OJ.inputs.members, (val, key) ->
    if key isnt 'factory' and key isnt 'makeSubNameSpace' and key isnt 'constants'
      count += 1
  expect count * 5

  OJ.each OJ.inputs.members, (val, key) ->
    if key isnt 'factory' and key isnt 'makeSubNameSpace' and key isnt 'constants'
      node = OJ.body.make key
      node.text 'Hi I\'m some text'

      nodeId = node.getId()
      dNode = document.getElementById nodeId
      # Test 1: node is in the DOM
      ok dNode, 'Node is in the DOM'

      # Test 2: IDs are equal
      deepEqual nodeId, dNode.id, 'Element IDs are equal'

      # Test 3: chaining works
      child = node.make key
      childId = child.getId()

      # Test 4: chained node is in the DOM
      cNode = document.getElementById childId
      deepEqual cNode.id, childId, 'Element IDs are equal'

      node.remove()
      # Test 5: node is removed
      equal `undefined`, document.getElementById(nodeId), 'Node has been removed'

      # Test 6: child is removed
      equal `undefined`, document.getElementById(childId), 'Child has been removed'

  