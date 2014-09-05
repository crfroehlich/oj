do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  
  ###
  Setup settings
  $.cookie.raw = true
  $.cookie.json = true
  
  Setup defaults
  https://github.com/carhartl/jquery-cookie/
  $.cookie.defaults.expires = 365
  $.cookie.defaults.path = '/'
  $.cookie.defaults.domain = 'oj.com'
  ###
  if not $ or not $.cookie
    throw new Error 'jQuery Cookie is a required dependency.'  
  $.cookie.defaults.secure = false
  
  cookies = {}
  
  OJ.cookie.register 'get', (cookieName, type) ->
    ret = ''
    if cookieName
      if type
        ret = $.cookie cookieName, type
      else
        ret = $.cookie cookieName    
      if ret
        cookies[cookieName] = ret
  
  OJ.cookie.register 'all', () ->
    ret = $.cookie()
    ret
    
  OJ.cookie.register 'set', (cookieName, value, opts) ->
    ret = ''
    if cookieName
      cookies[cookieName] = value
      if opts
        ret = $.cookie cookieName, value, opts
      else
        ret = $.cookie cookieName, value
    ret  
  
   OJ.cookie.register 'delete', (cookieName, opts) ->
    if cookieName
      if opts
        $.removeCookie cookieName, opts
      else
        $.removeCookie cookieName    
      delete cookies[cookieName]
    return
    
  OJ.cookie.register 'deleteAll', () ->
    cookies = {}
    OJ.each OJ.cookie.all, (val, key) ->
      OJ.cookie.delete key  
    return
    
  return
  
  
  

