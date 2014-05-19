((OJ)->
  inputName = 'checkbox'
  
  OJ.inputs.register inputName, (options, owner = OJ.body) ->
    
    defaults =
      checked: false
      indeterminate: false
      props:
        type: inputName
      styles: {}
      events:
        click: _.noop
    
    OJ.extend defaults, options, true
    
    ret = OJ.input defaults, owner
    if defaults.checked
      ret.attr 'checked', true
    else if defaults.indeterminate  
      ret.attr 'indeterminate', true
    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

