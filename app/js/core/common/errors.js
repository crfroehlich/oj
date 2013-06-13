/*global n$:true*/
(function _Error(n$){


    var AssignmentError = n$.Class('AssignmentError', Error, function _AE(message, fileName, lineNumber) {
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
        return error;
    });

    n$.errors.lift('AssignmentError', function(message, fileName, lineNumber){
        return new AssignmentError(message, fileName, lineNumber);
    });

    var ClassInheritanceError = n$.Class('ClassInheritanceError', Error, function _CIE(message, fileName, lineNumber) {
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
        return error;
    });

    n$.errors.lift('ClassInheritanceError', function(message, fileName, lineNumber){
        'use strict';
        return new ClassInheritanceError(message, fileName, lineNumber);
    });

}(window.$nameSpace$));
