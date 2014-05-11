((OJ) ->
  nodeName = 'x-input-group'
  className = 'inputgroup'
  
  OJ.components.members[nodeName] = className
  
  OJ.components.register className, (options, owner) ->
    defaults = 
      props:
        class: 'form-group'
      events:
        change: _.noop
      for: OJ.createUUID()
      labelText: ''
      inputType: 'text'
      placeholder: ''
    
    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName 
    
    cmpnt = ret.div props: class: 'form-group'
    cmpnt.label props: { for: defaults.for }, text: defaults.labelText
    
    cmpnt.value = () ->
      cmpnt.input.value
    cmpnt.input 
      props: 
        id: defaults.for, 
        type: OJ.enums.inputTypes[defaults.inputType].name, 
        class: 'form-control', 
        placeholder: defaults.placeholder 
          
      
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
