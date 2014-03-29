((OJ) ->
  method = undefined
  noop = ->

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
  OJ.console.register "assert", assert = (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.assert a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "count", count = (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.count a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "error", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.error a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "group", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.group a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "groupCollapsed", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.groupCollapsed a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "groupEnd", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.groupEnd a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "info", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.info a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "log", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.log a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "profile", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.profile a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "profileEnd", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.profileEnd a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "table", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.table a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "time", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.time a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "timeEnd", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.timeEnd a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "trace", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.trace a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "warn", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    'use strict'
    console.warn a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  return
) (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
