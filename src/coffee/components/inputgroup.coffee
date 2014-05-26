((OJ) ->
  nodeName = 'x-input-group'
  className = 'inputgroup'
  
  OJ.components.members[nodeName] = className
  
  OJ.components.register className, (options, owner) ->
    forId = OJ.createUUID()
    defaults = 
      props:
        class: 'form-group'
      events:
        change: OJ.noop
      for: forId
      labelText: ''
      inputOpts:
        props:
          id: forId
          type: 'text'
          class: ''
          placeholder: ''
          value: ''
    
    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName 
    
    cmpnt = ret.div props: class: 'form-group'
    
    ret.groupLabel = cmpnt.label props: { for: forId }, text: defaults.labelText
    
    defaults.inputOpts.props.class += ' form-control'
    ret.groupInput = cmpnt.input defaults.inputOpts
    
    ret.groupValue = () ->
      ret.groupInput.val()
      
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
