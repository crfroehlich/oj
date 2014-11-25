OJ = require '../oj'
$ = require 'jquery'
  
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
  
get = (cookieName, type) ->
  ret = ''
  if cookieName
    if type
      ret = $.cookie cookieName, type
    else
      ret = $.cookie cookieName    
    if ret
      cookies[cookieName] = ret
  
all = ->
  ret = $.cookie()
  ret
    
set = (cookieName, value, opts) ->
  ret = ''
  if cookieName
    cookies[cookieName] = value
    if opts
      ret = $.cookie cookieName, value, opts
    else
      ret = $.cookie cookieName, value
  ret  
  
del = (cookieName, opts) ->
  if cookieName
    if opts
      $.removeCookie cookieName, opts
    else
      $.removeCookie cookieName    
    delete cookies[cookieName]
  return
    
deleteAll = ->
  cookies = {}
  OJ.each OJ.cookie.all, (val, key) ->
    OJ.cookie.delete key  
  return
    
 OJ.cookie.register 'deleteAll', deleteAll
 OJ.cookie.register 'delete', del
 OJ.cookie.register 'set', set
 OJ.cookie.register 'get', get
 OJ.cookie.register 'all',  all
 
 module.exports = 
  deleteAll: deleteAll
  delete: del
  set: set
  get: get
  all:  all