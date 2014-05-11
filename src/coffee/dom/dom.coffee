((OJ) ->
  
  #Extend an object with OJ DOM methods and properties
  #'options' Object defining paramaters for dom construction.
  #'element' Object to extend
  #'OJ.dom'>Object representing a OJ.dom
  OJ.register 'dom', (el, parent = OJ.body ) ->
    'use strict'

    enabled = true
    
    el.add 'isValid', ->
       el and el.el instanceof HTMLElement
    
    isControlStillValid = ->
      valid = false is OJ.is.nullOrEmpty(el) and el.isValid()
      OJ.error.throwException 'el is null. Event bindings may not have been GCd.'  if false is valid
      valid
     
    # Add a CSS class to an element
    # An element to add class to
    # The value of the attribute
    el.add 'addClass', (name) ->
      el.$.addClass name if isControlStillValid()
      el

    # Bind an action to a jQuery element's event.
    el.add 'bind', (eventName, event) ->
      el.$.on eventName, event  if isControlStillValid()
      el
    
    el.add 'on', (eventName, event) ->
      el.$.on eventName, event  if isControlStillValid()
      el

    el.add 'off', (eventName, event) ->
      el.$.off eventName, event  if isControlStillValid()
      el
  
    # Bind an event to a key, when pressed in this control.
    # The OJ object (for chaining)
    el.add 'keyboard', (keys, event) ->
      Mousetrap.bind keys, el[event]  if isControlStillValid()
      el
    
    # Disable the element.
    # The OJ object (for chaining)
    el.add 'disable', ->
      if isControlStillValid()
        enabled = false
        el.attr 'disabled', 'disabled'
        el.addClass 'disabled', 'disabled'
      el
  
    # Empty the element.
    # The OJ object (for chaining) 
    el.add 'empty', ->
      el.$.empty()  if isControlStillValid()
      el

    # Enable the element.
    # The OJ object (for chaining) 
    el.add 'enable', ->
      if isControlStillValid()
        enabled = true
        el.removeAttr 'disabled'
        el.removeClass 'disabled'
      el

    # Get the DOM Element ID of this object.
    el.add 'getId', ->
      id = el[0].id  if isControlStillValid()
      id

    # Make the element invisible.
    el.add 'hide', ->
      el.css 'display', 'none'  if isControlStillValid()
      el

    # Get the length of this element.
    el.add 'length', ->
      len = 0
      len = OJ.number(el.$.length)  if isControlStillValid()
      len

    # Reference to the parent as passed in
    el.add 'parent', parent
    
    # Remove the node from the DOM
    el.add 'remove', ->
      if el and el.$
        el.$.remove()
        
        # Set the value of el to null to guarantee that isControlStillValid will be correct
        el = null
      null

    # Remove a CSS class from an element.
    el.add 'removeClass', (name) ->
      el.$.removeClass name  if isControlStillValid()
      el

    # Remove a property from an element. jQuery distinguishes between 'props' and 'attr'; hence 2 methods.
    el.add 'removeProp', (name) ->
      el.$.removeProp name  if isControlStillValid()
      el

    # Remove a property from an element. jQuery distinguishes between 'props' and 'attr'; hence 2 methods.
    el.add 'removeAttr', (name) ->
      el.$.removeAttr name  if isControlStillValid()
      el

    # Mark the required status of the element.
    el.add 'required', (truthy, addLabel) ->
      if isControlStillValid()
        switch OJ.bool(truthy)
          when true
            el.attr 'required', true
            el.addClass 'required'
          when false
            el.removeProp 'required'
            el.removeClass 'required'
      el

    # reference to the root of the node
    el.add 'root', el.root or parent

    # Make the element visible.
    el.add 'show', ->
      el.$.show()  if isControlStillValid()
      el

    # Toggle visibility
    el.add 'toggle', ->
      el.$.toggle()  if isControlStillValid()
      el

    # Toggle the element's enabled state.
    el.add 'toggleEnable', ->
      if isControlStillValid()
        if enabled
          el.disable()
        else
          el.enable()
      el

    # Trigger an event bound to a jQuery element.
    el.add 'trigger', (eventName, eventOpts) ->
      el.$.trigger eventName, eventOpts  if isControlStillValid()
      el

    # Unbind an action from a jQuery element's event.
    el.add 'unbind', (eventName, event) ->
      el.$.off eventName, event  if isControlStillValid()
      el

    # Get the value of the element.
    el.add 'val', (value) ->
      if isControlStillValid()
        if arguments.length is 1 and false is OJ.isNullOrUndefined(value)
          el.$.val value
          el
        else
          OJ.string el.$.val()

    el.add 'valueOf', ->
      el.val()

    el.add 'toString', ->
      el.val()

    el

  OJ.register 'isElementInDom', (elementId) ->
    false is OJ.is.nullOrEmpty OJ.getElement elementId

  OJ.register 'getElement', (id) ->
    if typeof document isnt 'undefined' 
      document.getElementById(id) 
    else 
      undefined

  return
  
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

