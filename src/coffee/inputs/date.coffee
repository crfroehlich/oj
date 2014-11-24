OJ = require '../oj'
require '../core/object'
input = require '../dom/input'

inputName = 'date'

inpt = (options, owner = require('../dom/body')) ->

  defaults =
    props:
      type: inputName
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true

  ret = input defaults, owner
  ret

OJ.inputs.register inputName, inpt
module.exports = inpt