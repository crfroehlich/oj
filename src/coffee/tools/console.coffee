OJ = require '../oj'

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
cnsl = OJ.global.console or {}

###
1. Stub out any missing methods with noop
2. Define the available methods on the OJ.console object
###
while methodLength--
  (->
    method = methods[methodLength]

    # Only stub undefined methods.
    cnsl[method] = OJ.noop unless cnsl[method]
  )()

Object.seal cnsl
Object.freeze cnsl
    
OJ.register 'console', cnsl
module.exports = cnsl