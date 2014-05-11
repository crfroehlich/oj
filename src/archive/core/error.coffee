(->
  'use strict'
  OJ.error.register "makeErrorObj", (errorType, friendlyMsg, esotericMsg) ->
    'use strict'
    
    # Generates a OJ Error object suitable for displaying a client-side error.
    # name="errorType" type="Enum"> Error type: Error or Warning 
    # name="friendlyMsg" type="String"> Friendly message. 
    # name="esotericMsg" type="String"> (Optional) Error message with Developer context. 
    #  The error object. 
    type: OJ.to.string(errorType, OJ.enums.errorType.warning.name)
    message: OJ.to.string(friendlyMsg)
    detail: OJ.to.string(esotericMsg)

  OJ.error.register "showError", (errorJson, friendlyMsg, esotericMsg) ->
    'use strict'
    
    # Displays an error message.
    # name="errorJson" type="Object/String"> An error object or a String for errorType. If object, should contain type, message and detail properties.
    # name="friendlyMsg" type="String"> A friendly message to display.
    # name="esotericMsg" type="String"> A verbose message for developers.
    #"Boolean">True
    e =
      name: ""
      type: ""
      message: friendlyMsg
      detail: esotericMsg
      display: true

    if OJ.isPlainObject(errorJson)
      OJ.extend e, errorJson
    else
      e.type = errorJson
    $errorsdiv = $("#DialogErrorDiv")
    $errorsdiv = $("#ErrorDiv")  if $errorsdiv.length <= 0
    if $errorsdiv.length > 0 and OJ.to.bool(e.display)
      $errorsdiv.OJErrorMessage
        name: e.name
        type: e.type
        message: e.message
        detail: e.detail

    OJ.debug.error e.message + "; " + e.detail
    true

  OJ.error.register "errorHandler", (errorMsg, includeCallStack, includeLocalStorage, doAlert) ->
    'use strict'
    OJ.debug.log window.localStorage  if OJ.hasWebStorage() and includeLocalStorage
    if doAlert
      $.OJDialog "ErrorDialog", errorMsg
    else
      OJ.debug.error "Error: " + errorMsg.message + " (Code " + errorMsg.code + ")", includeCallStack
    return

  OJ.error.register "exception", (message, name, fileName, lineNumber) ->
    ret =
      message: message
      name: name
      fileName: fileName
      lineNumber: lineNumber

    ret

  OJ.error.register "throwException", (exception, namespace, filename, line) ->
    
    #case 31703: a *lot* of people are misusing this class. You're supposed to wrap these params in a OJ.error.exception.
    #We're going to do the world a favor and try to detect when you send in raw values
    exception = OJ.error.exception(exception, namespace, filename, line)  if typeof (exception) is typeof ("string")
    OJ.debug.error exception
    throw exceptionreturn

  OJ.error.register "catchException", (exception) ->
    e =
      type: "js"
      message: exception.message
      detail: "JS Error type: " + exception.type + "<br/>\n" + "Stack: " + exception.stack
      display: OJ.debug.showExceptions() is true

    OJ.error.showError e
    return

  return
)()
