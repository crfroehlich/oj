OJ = require '../oj'
$ = require 'jquery'

# # dom


# Extend an object with OJ DOM methods and properties

methods = {}


# - `@el` Object to extend
# - `parent` parent object to which `@el` will be appended
class Node
  
  #parent: require('./body')
  
  constructor: (parent) ->

  make: (tagName, options) ->
    if tagName.make # provided a custom component directly
      tagName.make this, options
    else
      method = methods[tagName]
      if method
        method options
      else
        method = OJ.nodes[tagName] or OJ.components[tagName] or OJ.controls[tagName] or OJ.inputs[tagName]
        if method && !method.defaultBehavior
          method options, this
        else
          newOJNode = new Node()
          newOJNode.element = ojCreateElement @element, tagName, options
          newOJNode

  add: (name, value) ->
    this[name] = value
    # make sure we have a link back to ourselves, so we can inherit values
    @element.ojWrapper = this

  get: (name) ->
    value = this[name]
    if value is undefined
      parent = @element
      while parent = parent.parentNode
        if parent.ojWrapper
          return parent.ojWrapper.get name
    else
      value

[
  'on'
  'empty'
  'text'
  'removeClass'
  'addClass'
  'hasClass'
  'show'
  'hide'
  'attr'
  'css'
  'remove'
  'append'
  'val'
  'html'
  'prop'
  'trigger'
].forEach((method) ->
  Node.prototype[method] = () ->
    jQueryWrapper = @$
    jQueryWrapper[method].apply(jQueryWrapper, arguments)
)

Object.defineProperty(Node.prototype, '$',
  get: () ->
    jQueryWrapper = $(this.element)
    Object.defineProperty(this, '$',
      value: jQueryWrapper
    )
    jQueryWrapper
)


module.exports = OJ.Node = Node