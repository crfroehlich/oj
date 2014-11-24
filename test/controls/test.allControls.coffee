qunit = require 'qunit'

qunit.module 'all controls', setup: ->
  OJ['GENERATE_UNIQUE_IDS'] = true
    
    
qunit.test 'Test all controls', ->
  count = 0
  OJ.each OJ.controls.members, (val, key) ->
    if key isnt 'factory' and key isnt 'makeSubNameSpace' and key isnt 'constants'
      count += 1
  qunit.expect count * 7
    
  OJ.each OJ.controls.members, (val, key) ->
    if key isnt 'factory' and key isnt 'makeSubNameSpace' and key isnt 'constants'
      node = OJ.body.make key
      node.text 'Hi I\'m some text'
    
      # Test 1: tagName is div
      qunit.deepEqual node.controlName, val, 'Control is a ' + key.toUpperCase()
    
      nodeId = node.getId() 
      dNode = document.getElementById nodeId
      # Test 2: node is in the DOM
      qunit.ok dNode, 'Node is in the DOM' 
    
      # Test 3: IDs are equal
      qunit.deepEqual nodeId, dNode.id, 'Element IDs are equal'
    
      # Test 4: chaining works
      child = node.make key
      childId = child.getId()
      qunit.deepEqual child.controlName, val, 'Control is a ' + key.toUpperCase()
    
      # Test 5: chained node is in the DOM
      cNode = document.getElementById childId
      qunit.deepEqual cNode.id, childId, 'Element IDs are equal'
    
      node.remove()
      # Test 6: node is removed
      qunit.equal `undefined`, document.getElementById(nodeId), 'Node has been removed'
    
      # Test 7: child is removed
      qunit.equal `undefined`, document.getElementById(childId), 'Child has been removed'