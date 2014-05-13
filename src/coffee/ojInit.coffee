((OJ) ->
  
  OJ.makeSubNameSpace 'errors'
  OJ.makeSubNameSpace 'enums'
  OJ.makeSubNameSpace 'is'
  OJ.makeSubNameSpace 'instanceOf'
  OJ.makeSubNameSpace 'to'
  OJ.makeSubNameSpace 'nodes'
  OJ.makeSubNameSpace 'db'
  OJ.makeSubNameSpace 'components'
  OJ.makeSubNameSpace 'controls'
  OJ.makeSubNameSpace 'notifications'
  OJ.makeSubNameSpace 'history'
  OJ.makeSubNameSpace 'cookie'
  OJ.makeSubNameSpace 'async'
  
  OJ.components.register 'members', {}
  OJ.controls.register 'members', {}
  
  ###
  Configuration variables
  ###
  OJ['GENERATE_UNIQUE_IDS'] = false
  OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] = 'div'
  OJ['TRACK_ON_ERROR'] = false
  
  return
  
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
