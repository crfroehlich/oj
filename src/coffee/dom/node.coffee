OJ = require '../oj'
$ = require 'jquery'

# # dom


# Extend an object with OJ DOM methods and properties

methods = {}


# - `@el` Object to extend
# - `parent` parent object to which `@el` will be appended
class Node
  
  #parent: require('./body')
  
  constructor: (@element, parent) ->

  make: (tagName, options) ->
    if tagName.make # provided a custom component directly
      tagName.make this, options
    else
      method = methods[tagName]
      if method
        method options
      else
        method = OJ.components[tagName] or OJ.controls[tagName] or OJ.inputs[tagName]
        if method
          method options, this
        else
          newElement = createElement this.element, tagName, options
          new Node(newElement)
  add: (name, value) ->
    this[name] = value

['on', 'empty', 'text', 'removeClass', 'addClass', 'hasClass', 'show', 'hide', 'attr', 'css', 'remove', 'append', 'val', 'html'].forEach((method) ->
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


module.exports = Node