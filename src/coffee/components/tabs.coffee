OJ = require '../oj'
require '../ojInit'
component = require '../dom/component'

nodeName = 'x-tabs'
className = 'tabs'

OJ.components.members[className] = nodeName

cmpnt = (options, owner) ->
  defaults =
    tabs: {}
    props:
      class: ''

  OJ.extend defaults, options, true
  ret = component defaults, owner, nodeName

  tabs = ret.make 'ul', props: class: 'nav nav-tabs'
  content = ret.make 'div', props: class: 'tab-content'

  first = true
  OJ.each defaults.tabs, (tabVal, tabName) ->
    tabClass = ''
    if first
      first = false
      tabClass = 'active'
    a = tabs.make 'li', props: class: tabClass
      .make('a',
        text: tabName
        props:
          href: '#' + tabName
          'data-toggle': 'tab'
        events:
          click: ->
            a.$.tab 'show')

    tabContentClass = 'tab-pane ' + tabClass
    ret.add tabName, content.make('div', props: class: tabContentClass, id: tabName)

  ret

OJ.components.register className, cmpnt
module.exports = cmpnt