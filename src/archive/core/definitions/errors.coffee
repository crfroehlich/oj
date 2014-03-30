#global OJ:true
(_Error = (OJ) ->
  AssignmentError = OJ.Class("AssignmentError", Error, _AE = (message, fileName, lineNumber, exception) ->
    'use strict'
    error = this
    error.name = "AssignmentError"
    error.message = message or "Default Message"
    error.fileName = fileName  if fileName
    error.lineNumber = lineNumber  if lineNumber
    OJ.console.error error,
      outerStack: exception.stack
      outerMessage: exception.message

    error
  )
  OJ.errors.register "AssignmentError", (message, fileName, lineNumber, exception) ->
    new AssignmentError(message, fileName, lineNumber, exception)

  ClassInheritanceError = OJ.Class("ClassInheritanceError", Error, _CIE = (message, fileName, lineNumber, exception) ->
    'use strict'
    error = this
    error.name = "ClassInheritanceError"
    error.message = message or "Default Message"
    error.fileName = fileName  if fileName
    error.lineNumber = lineNumber  if lineNumber
    OJ.console.error error,
      outerStack: exception.stack
      outerMessage: exception.message

    error
  )
  OJ.errors.register "ClassInheritanceError", (message, fileName, lineNumber, exception) ->
    'use strict'
    new ClassInheritanceError(message, fileName, lineNumber, exception)

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
