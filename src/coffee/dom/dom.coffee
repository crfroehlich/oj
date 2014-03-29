((OJ) ->
  
  #Extend an object with OJ DOM methods and properties
  #"options" Object defining paramaters for dom construction.
  #"element" Object to extend
  #"OJ.dom">Object representing a OJ.dom
  OJ.register "dom", (el, parent = OJ.body ) ->
    'use strict'

    enabled = true
    ret = OJ.object()

    ret.add 'isValid', ->
       ret && ret.node instanceof ThinDOM
    
    isControlStillValid = ->
      valid = false is OJ.isNullOrEmpty(ret) and ret.isValid()
      OJ.error.throwException "ret is null. Event bindings may not have been GCd."  if false is valid
      valid
     
    # Add a CSS class to an element
    # An element to add class to
    # The value of the attribute
    ret.add 'addClass', (name) ->
      ret.$.addClass name if isControlStillValid()
      ret

    # Bind an action to a jQuery element's event.
    ret.add 'bind', (eventName, event) ->
      ret.$.bind eventName, event  if isControlStillValid()
      ret

    # Bind an event to a key, when pressed in this control.
    # The OJ object (for chaining)
    ret.add 'keyboard', (keys, event) ->
      Mousetrap.bind keys, ret[event]  if isControlStillValid()
      ret
    
    # 
    # Get the value of a data prop from an Element
    # 
    getData = (propName) ->
      data = null
      if isControlStillValid() and propName
        data = ret[0].dataset.propName  if ret[0] and ret[0].dataset and ret[0].dataset[propName]
      data

    # 
    # Set the value of a data prop from an Element (first to the DOM, then to memory, then to clientDb)
    # 
    setData = (propName, value) ->
      data = null
      if isControlStillValid() and propName
        data = value
        ret[0].dataset[propName] = value  if ret[0] and ret[0].dataset
      data

    setDataObj = (obj) ->
      OJ.each obj, (val, propName) ->
        setData propName, val
        return
      ret
    
    # Store property data on the control.
    # All properties, a single property, or the control if defining a property (for chaining)
    ret.add 'data', (prop, val) ->
      data = ""
      if isControlStillValid()
        if OJ.isPlainObject(prop)
          setDataObj prop
        else
          switch arguments_.length
            when 1
              data = getData prop
            when 2
              setData prop, val
              data = ret #for chaining
      data

    # Disable the element.
    # The OJ object (for chaining)
    ret.add 'disable', ->
      if isControlStillValid()
        enabled = false
        ret.attr 'disabled', 'disabled'
        ret.addClass 'disabled', 'disabled'
      ret
  
    # Empty the element.
    # The OJ object (for chaining) 
    ret.add 'empty', ->
      ret.$.empty()  if isControlStillValid()
      ret

    # Enable the element.
    # The OJ object (for chaining) 
    ret.add 'enable', ->
      if isControlStillValid()
        enabled = true
        ret.removeAttr 'disabled'
        ret.removeClass 'disabled'
      ret

    # Get the DOM Element ID of this object.
    ret.add 'getId', ->
      id = ret[0].id  if isControlStillValid()
      id

    # Make the element invisible.
    ret.add 'hide', ->
      ret.css 'display', 'none'  if isControlStillValid()
      ret

    # Get the length of this element.
    ret.add 'length', ->
      len = 0
      len = OJ.number(ret.$.length)  if isControlStillValid()
      len

    # Reference to the parent as passed in
    ret.add 'parent', parent
    
    # Remove the node from the DOM
    ret.add 'remove', ->
      if ret and ret.$
        ret.$.remove()
        
        # Set the value of ret to null to guarantee that isControlStillValid will be correct
        ret = null
      null

    # Remove a CSS class from an element.
    ret.add 'removeClass', (name) ->
      ret.$.removeClass name  if isControlStillValid()
      ret

    # Remove a property from an element. jQuery distinguishes between "props" and "attr"; hence 2 methods.
    ret.add 'removeProp', (name) ->
      ret.$.removeProp name  if isControlStillValid()
      ret

    # Remove a property from an element. jQuery distinguishes between "props" and "attr"; hence 2 methods.
    ret.add 'removeAttr', (name) ->
      ret.$.removeAttr name  if isControlStillValid()
      ret

    # Mark the required status of the element.
    ret.add 'required', (truthy, addLabel) ->
      if isControlStillValid()
        switch OJ.bool(truthy)
          when true
            ret.attr "required", true
            ret.addClass "required"
          when false
            ret.removeProp "required"
            ret.removeClass "required"
      ret

    # reference to the root of the node
    ret.add 'root', ret.root

    # Make the element visible.
    ret.add 'show', ->
      ret.$.show()  if isControlStillValid()
      ret

    # Toggle visibility
    ret.add 'toggle', ->
      ret.$.toggle()  if isControlStillValid()
      ret

    # Toggle the element's enabled state.
    ret.add 'toggleEnable', ->
      if isControlStillValid()
        if enabled
          ret.disable()
        else
          ret.enable()
      ret

    # Trigger an event bound to a jQuery element.
    ret.add 'trigger', (eventName, eventOpts) ->
      ret.$.trigger eventName, eventOpts  if isControlStillValid()
      ret

    # Unbind an action from a jQuery element's event.
    ret.add 'unbind', (eventName, event) ->
      ret.$.unbind eventName, event  if isControlStillValid()
      ret

    # Get the value of the element.
    ret.add 'val', (value) ->
      if isControlStillValid()
        if arguments_.length is 1 and false is OJ.isNullOrUndefined(value)
          ret.$.val value
          ret
        else
          OJ.string ret.$.val()

    ret.add 'valueOf', ->
      ret.val()

    ret.add 'toString', ->
      ret.val()

    ret

  OJ.register 'isElementInDom', (elementId) ->
    false is OJ.isNullOrEmpty OJ.getElement elementId

  OJ.register 'getElement', (id) ->
    if typeof document isnt 'undefined' 
      document.getElementById(id) 
    else 
      undefined

  return
  
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

