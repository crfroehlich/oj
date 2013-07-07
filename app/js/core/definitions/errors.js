/*global n$:true*/
(function _Error(n$){


    var AssignmentError = n$.Class('AssignmentError', Error, function _AE(message, fileName, lineNumber, exception) {
        'use strict';
        var error = this;
        
        error.name = "AssignmentError";
        error.message = message || "Default Message";
        if(fileName ) {
            error.fileName = fileName;
        }
        if(lineNumber) {
            error.lineNumber= lineNumber;
        }
        n$.console.error(error, { outerStack: exception.stack, outerMessage: exception.message });
        return error;
    });

    n$.errors.register('AssignmentError', function(message, fileName, lineNumber, exception){
        return new AssignmentError(message, fileName, lineNumber, exception);
    });

    var ClassInheritanceError = n$.Class('ClassInheritanceError', Error, function _CIE(message, fileName, lineNumber, exception) {
        'use strict';
        var error = this;
        
        error.name = "ClassInheritanceError";
        error.message = message || "Default Message";
        if(fileName ) {
            error.fileName = fileName;
        }
        if(lineNumber) {
            error.lineNumber= lineNumber;
        }
        n$.console.error(error, { outerStack: exception.stack, outerMessage: exception.message });
        return error;
    });

    n$.errors.register('ClassInheritanceError', function(message, fileName, lineNumber, exception){
        'use strict';
        return new ClassInheritanceError(message, fileName, lineNumber, exception);
    });

}(window.$nameSpace$));
