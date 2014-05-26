((OJ)->
  inputName = 'week'
  
  OJ.inputs.register inputName, (options, owner = OJ.body) ->
    
    defaults =
      props:
        type: inputName
      styles: {}
      events:
        click: OJ.noop
    
    OJ.extend defaults, options, true
    
    ret = OJ.input defaults, owner
    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

