(->
  "use strict"
  OJ.cookie.register "cookieNames", {}
  OJ.cookie.register "get", (cookiename) ->
    
    #/ <summary> Get the current value of a cookie by name.</summary>
    #/ <param name="cookiename" type="String">A OJ cookie() cookieName</param>
    #/ <returns type="Object">Cookie value</returns>
    cookie = $.cookie(cookiename)
    ret = ""
    ret = OJ.string(cookie)  if cookie isnt "[object Object]"
    ret

  OJ.cookie.register "set", (cookiename, value) ->
    
    #/ <summary> Get the current value of a cookie by name.</summary>
    #/ <param name="cookiename" type="String">A OJ cookie() cookieName</param>
    #/ <param name="value" type="String">Value to assign to cookie</param>
    #/ <returns type="Object">Cookie value</returns>
    $.cookie cookiename, value

  OJ.cookie.register "clear", (cookiename) ->
    
    #/ <summary> Clear the current value of a cookie by name.</summary>
    #/ <param name="cookiename" type="String">A OJ cookie() cookieName</param>
    #/ <returns type="Object">Cookie value</returns>
    $.cookie cookiename, ""

  OJ.cookie.register "clearAll", (exceptions) ->
    
    #/ <summary> Clear the current value of all OJ cookies.</summary>
    #/ <returns type="Boolean">Always true.</returns>
    preserveThese = []
    exceptions = exceptions or []
    OJ.iterate exceptions, (cookieName) ->
      val = OJ.cookie.get(cookieName)
      if false is OJ.isNullOrEmpty(val)
        preserveThese.push
          name: cookieName
          val: val

      return

    OJ.iterate OJ.cookie.cookieNames, (name) ->
      $.cookie name, null
      return

    OJ.iterate $.cookie(), (name) ->
      $.cookie name, null
      return

    OJ.iterate preserveThese, (cook) ->
      OJ.cookie.set cook.name, cook.val
      return

    true

  return
)()
