((OJ) ->
  nodeName = 'x-input-group'
  className = 'inputgroup'
  
  OJ.components.members[nodeName] = className
  
  OJ.components.register className, (options, owner) ->
    defaults = 
      props:
        class: 'form-group'
      for: OJ.uuid()
      labelText: ''
      inputType: 'text'
      placeholder: ''
    
    OJ.extend defaults, options
    ret = OJ.component defaults, owner, nodeName 
    
    root = ret.div props: class: 'form-group'
    root.label props: { for: defaults.for }, text: defaults.labelText
    root.input props: 
      id: defaults.for, 
      type: OJ.enums.inputTypes[defaults.inputType].name, 
      class: 'form-control', 
      placeholder: defaults.placeholder 
 
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
