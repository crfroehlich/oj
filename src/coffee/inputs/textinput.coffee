OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
input = require '../dom/input'

inputName = 'textinput'

inpt = (options, owner = require('../dom/body')) ->

  defaults =
    props:
      type: 'text'
      autocomplete: 'on'
      autosave: ''
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true

  ret = input defaults, owner
  ret

OJ.inputs.register inputName, inpt
module.exports = inpt
