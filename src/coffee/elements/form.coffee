OJ = require '../oj'
el = require '../dom/element'

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
  ret = el.element nodeName, defaults, owner, calledFromFactory

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

 

  ret

OJ.nodes.register nodeName, node
module.exports = node




