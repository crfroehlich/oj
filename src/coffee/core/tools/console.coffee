((OJ) ->
  method = undefined
  noop = _.noop

  methods = [
    "assert"
    "clear"
    "count"
    "debug"
    "dir"
    "dirxml"
    "error"
    "exception"
    "group"
    "groupCollapsed"
    "groupEnd"
    "info"
    "log"
    "markTimeline"
    "profile"
    "profileEnd"
    "table"
    "time"
    "timeEnd"
    "timeStamp"
    "trace"
    "warn"
  ]
  length = methods.length
  thisGlobal = (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this)
  console = (thisGlobal.console = thisGlobal.console or {})
  
  #stub out any missing methods. If the stubs execute, it's almost certainly in a browser I don't care about.
  while length--
    method = methods[length]
    
    # Only stub undefined methods.
    console[method] = noop  unless console[method]
  OJ.makeSubNameSpace "console"
  
  #Begin KLUDGE. What we really want to do is call console[methodName].apply(this, arguments); but
  #but this generates an exception, which is not at all expected. So to kludge these wrappers into being,
  #Accept a list of parameters from a-p--because who would ever need more than 16 parameters?
  OJ.console.register "assert", assert = (a...) ->
    'use strict'
    console.assert a...
    return

  OJ.console.register "count", count = (a...) ->
    'use strict'
    console.count a...
    return

  OJ.console.register "error", (a...) ->
    'use strict'
    console.error a...
    return

  OJ.console.register "group", (a...) ->
    'use strict'
    console.group a...
    return

  OJ.console.register "groupCollapsed", (a...) ->
    'use strict'
    console.groupCollapsed a...
    return

  OJ.console.register "groupEnd", (a...) ->
    'use strict'
    console.groupEnd a...
    return

  OJ.console.register "info", (a...) ->
    'use strict'
    console.info a...
    return

  OJ.console.register "log", (a...) ->
    'use strict'
    console.log a...
    return

  OJ.console.register "profile", (a...) ->
    'use strict'
    console.profile a...
    return

  OJ.console.register "profileEnd", (a...) ->
    'use strict'
    console.profileEnd a...
    return

  OJ.console.register "table", (a...) ->
    'use strict'
    console.table a...
    return

  OJ.console.register "time", (a...) ->
    'use strict'
    console.time a...
    return

  OJ.console.register "timeEnd", (a...) ->
    'use strict'
    console.timeEnd a...
    return

  OJ.console.register "trace", (a...) ->
    'use strict'
    console.trace a...
    return

  OJ.console.register "warn", (a...) ->
    'use strict'
    console.warn a...
    return

  return
) (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
