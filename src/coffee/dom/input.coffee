((OJ) ->

  ###
  Create an OJ Input Object through OJ.nodes.input
  ###
  input = (options = OJ.object(), owner) ->
    if not owner then throw new Error 'Cannot create an input without a parent'
    if not options.props or not options.props.type then throw new Error 'Cannot create an input without an input type'
    ret = owner.make 'input', options
    ret.add 'inputName', options.props.type
    ret
    
  OJ.register 'input', input

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
