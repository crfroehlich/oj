/*global OJ:true*/
(function() {

    var number = Object.create(null);
    Object.defineProperty(number, 'isNaN', { value:
        (function() {
            if(Number && Number.isNaN) {
                return Number.isNaN;
            }
            return isNaN;
        }())
    });

    Object.defineProperty(number, 'isFinite', { value:
        (function() {
            if(Number && Number.isFinite) {
                return Number.isFinite;
            }
            return isFinite;
        }())
    });

    Object.defineProperty(number, 'MAX_VALUE', { value:
        (function() {
            if(Number && Number.MAX_VALUE) {
                return Number.MAX_VALUE;
            }
            return 1.7976931348623157e+308;
        }())
    });

    Object.defineProperty(number, 'MIN_VALUE', { value:
        (function() {
            if(Number && Number.MIN_VALUE) {
                return Number.MIN_VALUE;
            }
            return 5e-324;
        }())
    });

    OJ.lift('number', number);
}());