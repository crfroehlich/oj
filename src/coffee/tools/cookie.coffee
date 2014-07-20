OJ = require '../oj'
$ = require 'jquery'
require '../core/object'
require './each'
require '../ojInit'

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
$.cookie.defaults.secure = false

cookies = {}
cookie = {}

cookie.get = (cookieName, type) ->
  ret = ''
  if cookieName
    if type
      ret = $.cookie cookieName, type
    else
      ret = $.cookie cookieName
    if ret
      cookies[cookieName] = ret

cookie.all = ->
  ret = $.cookie()
  ret

cookie.set = (cookieName, value, opts) ->
  ret = ''
  if cookieName
    cookies[cookieName] = value
    if opts
      ret = $.cookie cookieName, value, opts
    else
      ret = $.cookie cookieName, value
  ret

cookie.delete = (cookieName, opts) ->
  if cookieName
    if opts
      $.removeCookie cookieName, opts
    else
      $.removeCookie cookieName
    delete cookies[cookieName]
  return

cookie.deleteAll = ->
  cookies = {}
  OJ.each OJ.cookie.all, (val, key) ->
    OJ.cookie.delete key
  return

OJ.cookie.register 'get', cookie.get
OJ.cookie.register 'all', cookie.all
OJ.cookie.register 'set', cookie.set
OJ.cookie.register 'delete', cookie.delete
OJ.cookie.register 'deleteAll', cookie.deleteAll

module.exports = cookie