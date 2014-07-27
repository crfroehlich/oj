OJ = require '../oj'
require '../ojInit'
control = require '../dom/control'

controlName = 'y-icon'
friendlyName = 'icon'

OJ.controls.members[friendlyName] = controlName

cntrl = (options, owner) ->
  defaults =
    iconOpts:
      name: ''
      stackedIcon: ''
      swapIcon: ''
      size: false
      color: ''
      library: ''
      isFixedWidth: false
      isList: false
      isSpinner: false
    props:
      class: ''
    rootNodeType: 'span'

  OJ.extend defaults, options
  ret = control defaults, owner, controlName

  isToggled = false

  #TODO: Support for pictoicons
  #TODO: Support for other FontAwesome properties (stack, rotate, size, etc)

  classNameBase = 'fa '
  if defaults.iconOpts.isFixedWidth then classNameBase += 'fa-fw '
  if defaults.iconOpts.isList then classNameBase += 'fa-li '
  if defaults.iconOpts.isSpinner then classNameBase += 'fa-spin '
  if defaults.iconOpts.size
    if defaults.iconOpts.size > 1 and defaults.iconOpts.size <= 5
      classNameBase += 'fa-' + defaults.iconOpts.size + 'x '

  className = classNameBase + 'fa-' + defaults.iconOpts.name
  ret.myIcon = ret.make 'i', props: class: className

  #Toggles display between normal icon and swap icon, if a swap icon has been specified
  ret.toggleIcon = ->
    if defaults.iconOpts.swapIcon
      newIcon = defaults.iconOpts.name

      isToggled = !isToggled

      if isToggled
        ret.myIcon.$.removeClass('fa-' + newIcon)
        newIcon = defaults.iconOpts.swapIcon
      else
        ret.myIcon.$.removeClass('fa-' + defaults.iconOpts.swapIcon)

      ret.myIcon.$.addClass('fa-' + newIcon)


  ret

OJ.controls.register friendlyName, cntrl
module.exports = cntrl