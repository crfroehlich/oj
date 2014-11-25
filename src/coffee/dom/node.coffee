OJ = require '../oj'
$ = require 'jquery'

# # dom


# Extend an object with OJ DOM methods and properties

# - `@el` Object to extend
# - `parent` parent object to which `@el` will be appended
class Node
  
  #parent: require('./body')
  
  constructor: (@el, @parent) ->
    enabled = true
    @tagName = @el.tagName
    @['$'] = $(@el.get())
    @['0'] = @el.get()

  append: (params...) ->
    @el.append params...

  prepend: (params...) ->
    @el.prepend params...

  remove: (params...) ->
    @el.remove params...

  css: (params...) ->
    @el.css params...

  html: (params...) ->
    @el.html params...

  text: (params...) ->
    @el.text params...

  attr: (params...) ->
    @el.attr params...

  data: (params...) ->
    @el.data params...

  get: (params...) ->
    @el.get params...

  add: (key, val) ->
    @[key] = val

  isControlStillValid: ->
    isMethod = require '../tools/is'
    valid = false is isMethod.nullOrEmpty(@el) and @isValid()
    throw new Error 'el is null. Event bindings may not have been GCd.'  if false is valid
    valid

  # ## isValid
  isValid: ->
    @el and (@el.el instanceof HTMLElement or @el.el instanceof DocumentFragment)

  # ## addClass
  # Add a CSS class to an element

  # - `name` the name of the class to add
  addClass: (name) ->
    @['$'].addClass name if @isControlStillValid()
    @

  # ## bind
  # Bind an action to a jQuery element's event.
  bind: (eventName, event) ->
    @on eventName, event

  # ## on
  on: (eventName, event) ->
    @['$'].on eventName, event  if @isControlStillValid()
    @

  # ## off
  off: (eventName, event) ->
    @['$'].off eventName, event  if @isControlStillValid()
    @el

  # ## keyboard
  # Bind an event to a key, when pressed in this control.
  # The OJ object (for chaining)
  keyboard: (keys, event) ->
    #Mousetrap.bind keys, @el[event]  if @isControlStillValid()
    @

  # ## disable
  # Disable the element.
  # The OJ object (for chaining)
  disable: =>
    if @isControlStillValid()
      enabled = false
      @attr 'disabled', 'disabled'
      @addClass 'disabled', 'disabled'
    @

  # ## empty
  # Empty the element.
  # The OJ object (for chaining)
  empty: ->
    @['$'].empty() if @isControlStillValid()
    @

  # ## enable
  # Enable the element.
  # The OJ object (for chaining)
  enable: ->
    if @isControlStillValid()
      enabled = true
      @removeAttr 'disabled'
      @removeClass 'disabled'
    @

  # ## getId
  # Get the DOM Element ID of this object.
  getId: ->
    id = @[0].id  if @isControlStillValid()
    id

  # ## hide
  # Make the element invisible.
  hide: ->
    @css 'display', 'none'  if @isControlStillValid()
    @

  # ## length
  # Get the length of this element.
  length: ->
    to = require '../tools/to'
    len = 0
    len = to.number(@['$'].length)  if @isControlStillValid()
    len

  # ## remove
  # Remove the node from the DOM
  remove: ->
    if @el and @['$']
      @['$'].remove()

      # Set the value of @el to null to guarantee that isControlStillValid will be correct
      @el = null
      @['$'] = null
      @[0] = null
    null

  # ## removeClass
  # Remove a CSS class from an element.
  removeClass: (name) ->
    @['$'].removeClass name  if @isControlStillValid()
    @

  # ## removeProp
  # Remove a property from an element. jQuery distinguishes between 'props' and 'attr'; hence 2 methods.
  removeProp: (name) ->
    @['$'].removeProp name  if @isControlStillValid()
    @

  # ## removeAttr
  # Remove a property from an element. jQuery distinguishes between 'props' and 'attr'; hence 2 methods.
  removeAttr: (name) ->
    @['$'].removeAttr name  if @isControlStillValid()
    @

  # ## required
  # Mark the required status of the element.
  required: (truthy, addLabel) ->
    if @isControlStillValid()
      to = require '../tools/to'
      switch to.bool(truthy)
        when true
          @attr 'required', true
          @addClass 'required'
        when false
          @removeProp 'required'
          @removeClass 'required'
    @['$']
  
  # ## show
  # Make the element visible.
  show: ->
    @['$'].show()  if @isControlStillValid()
    @

  # ## toggle
  # Toggle visibility
  toggle: ->
    @['$'].toggle()  if @isControlStillValid()
    @

  # ## toggleEnable
  # Toggle the element's enabled state.
  toggleEnable: ->
    if @isControlStillValid()
      if enabled
        @disable()
      else
        @enable()
    @

  # ## trigger
  # Trigger an event bound to a jQuery element.
  trigger: (eventName, eventOpts) ->
    @['$'].trigger eventName, eventOpts  if @isControlStillValid()
    @el

  # ## unbind
  # Wrapper around `off`
  unbind: (eventName, event) ->
    @off eventName, event

  # ## val
  # Get or set the value of the element.
  val: (value) ->
    ret = @
    if @isControlStillValid()
      isMethod = require '../tools/is'
      if arguments.length is 1 and false is isMethod.nullOrUndefined(value)
        @['$'].val value
      else
        ret = @['$'].val()
    ret
    
  # ## valueOf
  # wrapper around `val`
  valueOf: ->
    @val()

  # ## toString
  # wrapper around `val`
  toString: ->
    @val()


module.exports = Node