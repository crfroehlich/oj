 # # OJ Post-Initialization

OJ = require './oj'
_ = require 'lodash'

# Simple array of anticipated/known child namespaces
  
subNameSpaces = [
  'errors'
  'enums'
  'instanceOf'
  'nodes'
  'db'
  'components'
  'controls'
  'inputs'
  'notifications'
  'cookie'
  'async'
]

# ## SubNameSpaces

# Pre-allocate certain common namespaces to avoid future race conditions.
# This does require that the order of operations loads OJ.coffee first and oJInit.coffee second
_.each subNameSpaces, (name) ->
  OJ.makeSubNameSpace name
  
# ## Configuration variables

# Automatically generate unique IDs for each node (default false)
OJ['GENERATE_UNIQUE_IDS'] = false
# Default root node for components/controls (default 'div')
OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] = 'div'
# Whether to hook into the global on error event to write errors to console (default false)
OJ['TRACK_ON_ERROR'] = false
#Whether to log all AJAX requests
OJ['LOG_ALL_AJAX'] = false
#Whether to log all AJAX errors
OJ['LOG_ALL_AJAX_ERRORS'] = false