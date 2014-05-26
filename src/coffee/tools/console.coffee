((OJ) ->
  methods = [
    'assert'
    'clear'
    'count'
    'debug'
    'dir'
    'dirxml'
    'error'
    'exception'
    'group'
    'groupCollapsed'
    'groupEnd'
    'info'
    'log'
    'memory'
    'profile'
    'profileEnd'
    'table'
    'time'
    'timeEnd'
    'timeStamp'
    'timeline'
    'timelineEnd'
    'trace'
    'warn'
  ]
  methodLength = methods.length
  console = OJ.global.console or {}
  OJ.makeSubNameSpace 'console'
  
  ###
  1. Stub out any missing methods with noop
  2. Define the available methods on the OJ.console object
  ###
  while methodLength--
    (->
      method = methods[methodLength]
    
      # Only stub undefined methods.
      console[method] = OJ.noop unless console[method]
    
      #Define the method on the OJ console namespace
      OJ.console.register method, (params...) ->
        console[method] params...
    )()

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
