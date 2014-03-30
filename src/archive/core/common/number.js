/*global OJ:true*/
(function (OJ) {

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

    OJ.register('number', number);





    function validateFloatMinValue(value, minvalue, excludeRangeLimits) {
        var nValue = parseFloat(value);
        var nMinValue = parseFloat(minvalue);
        var isValid = true;
        if (excludeRangeLimits === undefined) {
            excludeRangeLimits = false;
        }
        if (nMinValue !== undefined) {
            if (nValue === undefined || excludeRangeLimits ? nValue <= nMinValue : nValue < nMinValue) {
                isValid = false;
            }
        }
        return isValid;
    }
    OJ.register('validateFloatMinValue', validateFloatMinValue);

    function validateFloatMaxValue(value, maxvalue, excludeRangeLimits) {
        var nValue = parseFloat(value);
        var nMaxValue = parseFloat(maxvalue);
        var isValid = true;
        if (excludeRangeLimits === undefined) {
            excludeRangeLimits = false;
        }
        if (nMaxValue !== undefined) {
            if (nValue === undefined || excludeRangeLimits ? nValue >= nMaxValue : nValue > nMaxValue) {
                isValid = false;
            }
        }
        return isValid;
    }
    OJ.register('validateFloatMaxValue', validateFloatMaxValue);

    function validateFloatPrecision(value, precision) {
        var isValid = true;

        var regex;
        if (precision > 0) {
            /* Allow any valid number -- we'll round later */
            regex = /^\-?\d*(\.\d+)?$/g; //Case 28696 - changed regex to NOT accept a '.'
        } else {
            /* Integers Only */
            regex = /^\-?\d*$/g;
        }
        if (isValid && !regex.test(value)) {
            isValid = false;
        }
        return isValid;
    }
    OJ.register('validateFloatPrecision', validateFloatPrecision);

    function validateInteger(value) {
        var regex = /^\-?\d+$/g;
        return (regex.test(value) || value === null);
    }
    OJ.register('validateInteger', validateInteger);

    function validateGreaterThanZero(value) {
        var regex = /^(\d*(\.|)\d*)$/g;
        return ((regex.test(value) && number(value) > 0) || value === null);
    }
    OJ.register('validateGreaterThanZero', validateGreaterThanZero);

    function getMaxValueForPrecision(precision, maxPrecision) {
        var i,
            ret = '',
            precisionMax = maxPrecision || 6;
        if (precision > 0 &&
            precision <= precisionMax) {

            ret += '.';
            for (i = 0; i < precision; i += 1) {
                ret += '9';
            }
        }
        return ret;
    }
    OJ.register('getMaxValueForPrecision', getMaxValueForPrecision);

    //Validates the character length of the string-ified number
    function validateMaxLength(value, maxLength) {
        return (value.length <= maxLength);
    }
    OJ.register('validateMaxLength', validateMaxLength);

}((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ));
