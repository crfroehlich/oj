((OJ) ->
  
  OJ.makeSubNameSpace 'errors'
  OJ.makeSubNameSpace 'enums'
  OJ.makeSubNameSpace 'is'
  OJ.makeSubNameSpace 'instanceOf'
  OJ.makeSubNameSpace 'to'
  OJ.makeSubNameSpace 'nodes'
  OJ.makeSubNameSpace 'db'
  OJ.makeSubNameSpace 'components'
  OJ.components.register 'members', {}
  OJ['GENERATE_UNIQUE_IDS'] = true
  return
  
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
