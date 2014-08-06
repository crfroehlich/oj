# # dom

do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  
  # Extend an object with OJ DOM methods and properties
  
  # - `el` Object to extend
  # - `parent` parent object to which `el` will be appended
  OJ.register 'dom', (el, parent = OJ.body ) ->
    'use strict'

    enabled = true
    
    # ## isValid
    el.add 'isValid', ->
       el and (el.el instanceof HTMLElement or el.el instanceof DocumentFragment)
    
    isControlStillValid = ->
      valid = false is OJ.is.nullOrEmpty(el) and el.isValid()
      throw new Error 'el is null. Event bindings may not have been GCd.'  if false is valid
      valid
    
    # ## addClass  
    # Add a CSS class to an element
    
    # - `name` the name of the class to add
    el.add 'addClass', (name) ->
      el.$.addClass name if isControlStillValid()
      el
    
    # ## bind
    # Bind an action to a jQuery element's event.
    el.add 'bind', (eventName, event) ->
      el.on eventName, event
    
    # ## on
    el.add 'on', (eventName, event) ->
      el.$.on eventName, event  if isControlStillValid()
      el

    # ## off
    el.add 'off', (eventName, event) ->
      el.$.off eventName, event  if isControlStillValid()
      el
  
    # ## keyboard
    # Bind an event to a key, when pressed in this control.
    # The OJ object (for chaining)
    el.add 'keyboard', (keys, event) ->
      Mousetrap.bind keys, el[event]  if isControlStillValid()
      el
    
    # ## disable
    # Disable the element.
    # The OJ object (for chaining)
    el.add 'disable', ->
      if isControlStillValid()
        enabled = false
        el.attr 'disabled', 'disabled'
        el.addClass 'disabled', 'disabled'
      el
  
    # ## empty
    # Empty the element.
    # The OJ object (for chaining) 
    el.add 'empty', ->
      el.$.empty()  if isControlStillValid()
      el

    # ## enable
    # Enable the element.
    # The OJ object (for chaining) 
    el.add 'enable', ->
      if isControlStillValid()
        enabled = true
        el.removeAttr 'disabled'
        el.removeClass 'disabled'
      el

    # ## getId
    # Get the DOM Element ID of this object.
    el.add 'getId', ->
      id = el[0].id  if isControlStillValid()
      id

    # ## hide
    # Make the element invisible.
    el.add 'hide', ->
      el.css 'display', 'none'  if isControlStillValid()
      el
    
    # ## length
    # Get the length of this element.
    el.add 'length', ->
      len = 0
      len = OJ.to.number(el.$.length)  if isControlStillValid()
      len

    # ## parent
    # Reference to the parent as passed in
    el.add 'parent', parent
    
    # ## remove
    # Remove the node from the DOM
    el.add 'remove', ->
      if el and el.$
        el.$.remove()
        
        # Set the value of el to null to guarantee that isControlStillValid will be correct
        el = null
      null
    
    # ## removeClass
    # Remove a CSS class from an element.
    el.add 'removeClass', (name) ->
      el.$.removeClass name  if isControlStillValid()
      el

    # ## removeProp
    # Remove a property from an element. jQuery distinguishes between 'props' and 'attr'; hence 2 methods.
    el.add 'removeProp', (name) ->
      el.$.removeProp name  if isControlStillValid()
      el

    # ## removeAttr
    # Remove a property from an element. jQuery distinguishes between 'props' and 'attr'; hence 2 methods.
    el.add 'removeAttr', (name) ->
      el.$.removeAttr name  if isControlStillValid()
      el

    # ## required
    # Mark the required status of the element.
    el.add 'required', (truthy, addLabel) ->
      if isControlStillValid()
        switch OJ.to.bool(truthy)
          when true
            el.attr 'required', true
            el.addClass 'required'
          when false
            el.removeProp 'required'
            el.removeClass 'required'
      el

    # ## root
    # reference to the root of the node
    el.add 'root', el.root or parent

    # ## show
    # Make the element visible.
    el.add 'show', ->
      el.$.show()  if isControlStillValid()
      el

    # ## toggle
    # Toggle visibility
    el.add 'toggle', ->
      el.$.toggle()  if isControlStillValid()
      el

    # ## toggleEnable
    # Toggle the element's enabled state.
    el.add 'toggleEnable', ->
      if isControlStillValid()
        if enabled
          el.disable()
        else
          el.enable()
      el

    # ## trigger
    # Trigger an event bound to a jQuery element.
    el.add 'trigger', (eventName, eventOpts) ->
      el.$.trigger eventName, eventOpts  if isControlStillValid()
      el

    # ## unbind
    # Wrapper around `off`
    el.add 'unbind', (eventName, event) ->
      el.off eventName, event
      
    # ## val
    # Get or set the value of the element.
    el.add 'val', (value) ->
      if isControlStillValid()
        if arguments.length is 1 and false is OJ.is.nullOrUndefined(value)
          el.$.val value
          el
        else
          el.$.val()

    # ## valueOf
    # wrapper around `val`
    el.add 'valueOf', ->
      el.val()

    # ## toString
    # wrapper around `val`
    el.add 'toString', ->
      el.val()

    el

  OJ.register 'isElementInDom', (elementId) ->
    false is OJ.is.nullOrEmpty OJ.getElement elementId

  OJ.register 'getElement', (id) ->
    if typeof document isnt 'undefined' 
      document.getElementById(id) 
  
  return
  


