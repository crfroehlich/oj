OJ = require 'ojs'
QUnit.module 'all nodes', setup: ->
  OJ['GENERATE_UNIQUE_IDS'] = true


QUnit.test 'Test all nodes', ->
  count = 0
  OJ.each OJ.nodes.members, (val) ->
    if val isnt 'factory' and val isnt 'get' and val isnt 'makeSubNameSpace' and val isnt 'constants'
      count += 1
  expect count * 7

  OJ.each OJ.nodes.members, (val, key) ->
    if val isnt 'factory' and val isnt 'get' and val isnt 'makeSubNameSpace' and val isnt 'constants'
      node = OJ.body.make val
      node.text 'Hi I\'m some text'

      # Test 1: tagName is div
      deepEqual node.tagName, val, 'Node is a ' + val.toUpperCase()

      nodeId = node.getId()
      dNode = document.getElementById nodeId
      # Test 2: node is in the DOM
      ok dNode, 'Node is in the DOM'

      # Test 3: IDs are equal
      deepEqual nodeId, dNode.id, 'Element IDs are equal'

      # Test 4: chaining works
      child = node.make val
      childId = child.getId()
      deepEqual child.tagName, val, 'Node is a ' + val.toUpperCase()

      # Test 5: chained node is in the DOM
      cNode = document.getElementById childId
      deepEqual cNode.id, childId, 'Element IDs are equal'

      node.remove()
      # Test 6: node is removed
      equal `undefined`, document.getElementById(nodeId), 'Node has been removed'

      # Test 7: child is removed
      equal `undefined`, document.getElementById(childId), 'Child has been removed'