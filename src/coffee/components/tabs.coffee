((OJ) ->
  nodeName = 'x-tabs'
  className = 'tabs'
  
  OJ.components.members[nodeName] = className
  
  OJ.components.register className, (options, owner) ->
    defaults = 
      tabs: {}
      props:
        class: ''
    
    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName 
    
    tabs = ret.ul props: class: 'nav nav-tabs'
    content = ret.div props: class: 'tab-content'
    
    first = true
    OJ.each defaults.tabs, (tabVal, tabName) ->
      tabClass = ''
      if first
        first = false
        tabClass = 'active'
      a = tabs.li props: class: tabClass
        .a 
          text: tabName
          props: 
            href: '#' + tabName
            'data-toggle': 'tab'
          events:
            click: ->
              a.$.tab 'show'
              
      tabContentClass = 'tab-pane ' + tabClass
      ret.add tabName, content.div props: class: tabContentClass, id: tabName
      
      return
    
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
