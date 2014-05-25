((OJ) ->
  
  subNameSpaces = [
    'errors'
    'enums'
    'is'
    'instanceOf'
    'to'
    'nodes'
    'db'
    'components'
    'controls'
    'inputs'
    'notifications'
    'history'
    'cookie'
    'async'
  ]
  
  _.each subNameSpaces, (name) ->
    OJ.makeSubNameSpace name
  
  ###
  Configuration variables
  ###
  OJ['GENERATE_UNIQUE_IDS'] = false
  OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] = 'div'
  OJ['TRACK_ON_ERROR'] = false
  
  return
  
)  ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
