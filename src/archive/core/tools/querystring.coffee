(->
  
  # adapted from 
  # http://stackoverflow.com/questions/901115/get-querystring-values-in-javascript/2880929#2880929
  OJ.register "queryString", ->
    
    #/ <summary>
    #/     usage:    page.html?param=value&param2=value2
    #/     &#10;1 - var qs = OJ.queryString();
    #/     &#10;2 - qs.param   -->  'value'
    #/     &#10;3 - qs.param2  -->  'value2'
    #/ </summary>
    #/ <returns type="Object" />
    "use strict"
    ret = {}
    ojInternal =
      e: ""
      a: /\+/g # Regex for replacing addition symbol with a space
      r: /([^&=]+)=?([^&]*)/g
      d: (s) ->
        decodeURIComponent s.replace(ojInternal.a, " ")

      q: OJ.window.location().search.substring(1)

    ret[ojInternal.d(ojInternal.e[1])] = ojInternal.d(ojInternal.e[2])  while ojInternal.e = ojInternal.r.exec(ojInternal.q)
    ret.pageName = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1)  if false is OJ.contains(ret, "pageName")
    ret

  return
)()
