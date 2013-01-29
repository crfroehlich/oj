// monad.js
// Douglas Crockford
// 2013-01-26

// Public Domain

// The MONAD function is a macroid that produces monad constructor functions.
// It can take an optional modifier function, which is a function that is
// allowed to modify new monads at the end of the construction processes.

// A monad constructor (sometimes called 'unit' or 'return' in some mythologies)
// comes with three methods, lift, lift_value, and method, all of which can add
// methods and properties to the monad's prototype.

// A monad has a 'bind' method that takes a function that receives a value and
// is usually expected to return a monad.

//    var identity = MONAD();
//    var monad = identity("Hello world.");
//    monad.bind(alert);

//    var ajax = MONAD()
//        .lift('alert', alert);
//    var monad = ajax("Hello world.");
//    monad.alert();

//    var maybe = MONAD(function (monad, value) {
//        if (value === null || value === undefined) {
//            monad.is_null = true;
//            monad.bind = function () {
//                return monad;
//            };
//            return null;
//        }
//        return value;
//    });
//    var monad = maybe(null);
//    monad.bind(alert);    // Nothing happens.

function MONAD(modifier) {
    'use strict';

// Each unit constructor has a monad prototype. The prototype will contain an
// is_monad property for classification, as well as all inheritable methods.

    var prototype = Object.create(null);
    prototype.is_monad = true;

// Each call to MONAD will produce a new unit constructor function.

    function unit(value) {

// Construct a new monad.

        var monad = Object.create(prototype);

// In some mythologies 'bind' is called 'pipe' or '>>='.
// The bind method will deliver the unit's value parameter to a function.

        monad.bind = function (func, args) {

// bind takes a function and an optional array of arguments. It calls that
// function passing the monad's value and bind's optional array of args.

// With ES6, this horrible return statement can be replaced with

//          return func(value, ...args);

            return func.apply(
                undefined,
                [value].concat(Array.prototype.slice.apply(args || []))
            );
        };

// If MONAD's modifier parameter is a function, then call it, passing the monad
// and the value.

        if (typeof modifier === 'function') {
            value = modifier(monad, value);
        }

// Return the shiny new monad.

        return monad;
    }
    unit.method = function (name, func) {

// Add a method to the prototype.

        prototype[name] = func;
        return unit;
    };
    unit.lift_value = function (name, func) {

// Add a method to the prototype that calls bind with the func. This can be
// used for ajax methods that return values other than monads.

        prototype[name] = function () {
            return this.bind(func, arguments);
        };
        return unit;
    };
    unit.lift = function (name, func) {

// Add a method to the prototye that calls bind with the func. If the value
// returned by the func is not a monad, then make a monad.

        prototype[name] = function () {
            var result = this.bind(func, arguments);
            return result && result.is_monad === true ? result : unit(result);
        };
        return unit;
    };
    return unit;
}
