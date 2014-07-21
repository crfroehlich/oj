OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'

# # form

nodeName = 'form'

node = (options, owner = OJ.body, calledFromFactory = false) ->

  defaults =
    props:
      action: ''
      method: ''
      name: ''
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true
  ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text

  ret.add 'validator', ret.$.validate(
    highlight: (element) ->
      $elm = $(element)
      $elm.attr 'OJ_invalid', '1'
      $elm.animate backgroundColor: 'red'
      null

    unhighlight: (element) ->
      $elm = $(element)
      if $elm.attr('OJ_invalid') is '1'
        $elm.css 'background-color', 'yellow'
        $elm.attr 'OJ_invalid', '0'
        setTimeout (->
          $elm.animate backgroundColor: 'transparent'
        ), 500
      null
  )

  ret.add 'isFormValid', ->
    ret.$.valid() and (not ret.validator.invalidElements() or ret.validator.invalidElements().length is 0)

  if false is calledFromFactory then OJ.nodes.factory ret, owner

  ret

OJ.nodes.register nodeName, node
module.exports = node




