OJ = require '../oj'
require 'html5-history-api'

hstr = {}

if OJ.global.addEventListener
  eventName = 'addEventListener'
  eventInfo = ''
else
  eventName = 'attachEvent'
  eventInfo = 'on'

hstr.pushState = (pageName, event) ->
  if pageName
    # keep the link in the browser history
    history.pushState null, null, '#' + pageName

    # here can cause data loading, etc.

    if event
      # do not give a default action
      if event.preventDefault
        event.preventDefault()
      else
        event.returnValue = false
  false

hstr.restoreState = (location) ->
  pageName = location.hash
  if not pageName
    pageName = location.href.split('#')[1]
  if pageName
    pageName = pageName.replace '#', ''
    OJ.publish 'restoreState', pageName: pageName, location: location
  return

###
hang on popstate event triggered by pressing back/forward in browser
###
OJ.global[eventName] eventInfo + 'popstate', ((event) ->

  # we get a normal Location object

  ###
  Note, this is the only difference when using this library,
  because the object document.location cannot be overriden,
  so library the returns generated 'location' object within
  an object window.history, so get it out of 'history.location'.
  For browsers supporting 'history.pushState' get generated
  object 'location' with the usual 'document.location'.
  ###
  returnLocation = history.location or document.location

  ###
  here can cause data loading, etc.
  ###
  OJ.history.restoreState returnLocation

  return
), false

Object.seal hstr
Object.freeze hstr

OJ.register 'hstr', hstr
module.exports = hstr