#global OJ:true,thisGlobal:true
((OJ) ->
  "use strict"
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
  thisGlobal = ((if typeof global isnt "undefined" and global then global else (if (typeof window isnt "undefined") then window else this)))
  length = methods.length
  console = (thisGlobal.console = thisGlobal.console or {})
  
  #stub out any missing methods. If the stubs execute, it's almost certainly in a browser I don't care about.
  while length--
    method = methods[length]
    
    # Only stub undefined methods.
    console[method] = noop  unless console[method]
  prepareLoggly = OJ.method((url) ->
    ret.loggly = ret.loggly or {}
    ret.loggly.info = new thisGlobal.loggly(
      url: url
      level: "log"
    )
    ret.loggly.perf = new thisGlobal.loggly(
      url: url
      level: "debug"
    )
    ret.loggly.warn = new thisGlobal.loggly(
      url: url
      level: "warn"
    )
    ret.loggly.error = new thisGlobal.loggly(
      url: url
      level: "error"
    )
    return
  )
  initLoggly = (keepTrying) ->
    try
      key = OJ.session.getLogglyInput()
      host = (if ("https:" is document.location.protocol) then "https://logs.loggly.com" else "http://logs.loggly.com")
      url = host + "/inputs/" + key + "?rt=1"
      if loggly
        prepareLoggly url
      else
        thisGlobal.setTimeout (->
          initLoggly()
          return
        ), 5000
    catch e
      
      #This kludge is for Dev. getLogglyInput() won't fail in compiled code.
      if keepTrying isnt false
        thisGlobal.setTimeout (->
          initLoggly false
          return
        ), 5000
    return

  initLoggly()
  OJ.makeSubNameSpace "console"
  
  #Begin KLUDGE. What we really want to do is call thisGlobal.console[methodName].apply(this, arguments); but
  #but this generates an exception, which is not at all expected. So to kludge these wrappers into being,
  #Accept a list of parameters from a-p--because who would ever need more than 16 parameters?
  OJ.console.register "assert", assert = (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.assert a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "count", count = (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.count a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "error", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.error a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "group", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.group a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "groupCollapsed", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.groupCollapsed a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "groupEnd", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.groupEnd a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "info", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.info a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "log", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.log a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "profile", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.profile a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "profileEnd", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.profileEnd a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "table", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.table a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "time", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.time a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "timeEnd", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.timeEnd a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "trace", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.trace a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  OJ.console.register "warn", (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) ->
    "use strict"
    thisGlobal.console.warn a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p
    return

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof thisGlobal isnt "undefined" then thisGlobal else this)))).OJ
