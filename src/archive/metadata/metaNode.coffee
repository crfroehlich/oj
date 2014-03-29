#global OJ:true 
((OJ, $) ->
  
  ###
  The unsanitized base class for the representation of a DOM element at the highest level.
  ###
  NodeAbstract = (id, el, _$el) ->
    'use strict'
    
    #An abstract representation of a Node that defers validation until assignment.
    #"EntityAbstract">An EntityAbstract
    internalEntity = id: id
    entity = this
    Object.defineProperty entity, "add",
      value: (name, val) ->
        OJ.property entity, name, val
        return

    Object.defineProperty entity, "id",
      set: (val) ->
        throw new TypeError("DOM Element Identifiers must be Strings")  if false is OJ.is.string(val)
        OJ.errors.AssignmentError "DOM Element Identifiers cannot be changed once assigned."  if internalEntity.id.length > 0
        internalEntity.id = val
        return

      get: ->
        internalEntity.id

    Object.defineProperty entity, "0",
      set: (val) ->
        OJ.errors.AssignmentError "DOM Element Identifiers cannot be changed once assigned."  if internalEntity.id.length > 0
        if false is val instanceof HTMLElement
          throw new TypeError("Invalid assignment. Element must be of type HTMLElement.")
        else
          internalEntity.id = val.id
        return

      get: ->
        ret = el
        if not ret and internalEntity.id
          ret = document.getElementById(internalEntity.id)
          
          #Kludge, but body usually doesn't have an id. At least you're guaranteed to have only one of them per page.
          ret = document.getElementsByTagName("body")[0]  if not ret and internalEntity.id is "body"
          throw new TypeError("Invalid assignment. Element must be of type HTMLElement.")  if ret and false is ret instanceof HTMLElement
        ret

    Object.defineProperty entity, "?",
      set: (val) ->
        if false is OJ.is.vendorObject(el)
          throw new TypeError("Invalid assignment. Vendor element must match the current vendor framework.")
        else
          internalEntity.id = val.id
        return

      get: ->
        ret = _$el
        if not ret and internalEntity.id
          ret = OJ.to.vendorDomObject(internalEntity.id)
          throw new TypeError("Invalid assignment. Vendor element must match the current vendor framework.")  if false is OJ.is.vendorObject(ret)
        ret

    Object.defineProperty entity, "length",
      set: (val) ->
        throw new Error("Invalid assignment. Length is a readonly property.")

      get: ->
        len = -1
        if internalEntity.id
          el = OJ.to.vendorDomObject(internalEntity.id)
          throw new TypeError("Invalid assignment. Vendor element must match the current vendor framework.")  if false is OJ.is.vendorObject(el)
          len = el.length
        len

    unless entity.id
      if id
        entity.id = id
      else if el and el.id
        entity.id = el.id
      else entity.id = _$el.id  if _$el and _$el.id
    entity

  OJ.metadata.register "NodeAbstract", NodeAbstract
  
  ###
  Node is the class representing an OJ DOM Node.
  I'm using it less for inheritance chaining an more as a way to explicitly Type my instance data.
  Returns an Object of type Node: call either by creating Object.create(new Nodee()) or
  at some later point by someObj.prototype = new Node().
  ###
  Node = OJ.Class("Node", NodeAbstract, ->
    'use strict'
    
    #Instance an OJ Node prototype
    #"entity" type="Entity">An Entity object
    #"Node">Description
    node = this
    Object.defineProperty node, "vendorVal",
      get: ->
        ret = null
        ret = node["?"].val.call(node)  if node and node["?"]
        ret

      set: (val) ->
        ret = null
        ret = node["?"].val.call(node, val)  if node and node["?"]
        ret

    Object.defineProperty node, "Val",
      value: null
      configurable: true
      writable: true

    Object.defineProperty node, "tagName",
      get: ->
        ret = "Unknown Tag Name"
        ret = node[0].tagName  if node and node["0"]
        ret

      set: (val) ->
        throw new Error("Assignment error. Node tag name is readonly.")

    Object.defineProperty node, "rootNode",
      value: null
      writable: true

    Object.defineProperty node, "parentNode",
      value: null
      writable: true

    Object.defineProperty node, "childNodes",
      value: []
      writable: true

    Object.defineProperty node, "valueOf",
      value: ->
        node

    Object.defineProperty node, "value",
      get: ->
        ret = null
        if null isnt node.val
          ret = node.val
        else
          ret = node.vendorVal()
        ret

      set: (val) ->
        ret = val
        if null isnt node.val
          node.val = ret
        else
          node.vendorVal ret
        ret

    node
  )
  OJ.metadata.register "Node", Node
  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ, OJ["?"]
