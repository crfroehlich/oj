do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  nodeName = 'x-tabs'
  className = 'tabs'
  
  OJ.components.members[className] = nodeName
  
  OJ.components.register className, (options, owner) ->
    defaults = 
      tabs: {}
      props:
        class: ''
    
    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName 
    
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
      
      return
    
    ret

  return

