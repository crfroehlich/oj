/*global nameSpace:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

// It's desirable that these tests not be optimized for pure functional programming,
// because they need to quickly communicate their intention to the reader.
// Unless testing abstraction and encapsulation, it is better to be dundant and verbose,
// as this will make troubleshooting failures easier for anyone who might come behind

// String conversion checks
(function _toString(nameSpace) {

    //#region nameSpace.is.string
    module("nameSpace.to.string");
    test( "nameSpace.to.string(null)", function() {
        deepEqual( nameSpace.to.string(null) === '', true, "nameSpace.to.string converts null to string empty.");
    });

    test( "nameSpace.to.string(null, 'a')", function() {
        deepEqual( nameSpace.to.string(null, 'a') === 'a', true, "nameSpace.to.string converts null to 'a'.");
    });

    test( "nameSpace.to.string(undefined)", function() {
        deepEqual( nameSpace.to.string(undefined) === '', true, "nameSpace.to.string converts undefined to string empty.");
    });

    test( "nameSpace.to.string(undefined, 'a')", function() {
        deepEqual( nameSpace.to.string(undefined, 'a') === 'a', true, "nameSpace.to.string converts undefined to 'a'.");
    });

    test( "nameSpace.to.string(NaN)", function() {
        deepEqual( nameSpace.to.string(NaN) === '', true, "nameSpace.to.string converts NaN to ''.");
    });

    test( "nameSpace.to.string(Infinity)", function() {
        deepEqual( nameSpace.to.string(Infinity) === '', true, "nameSpace.to.string converts Infinity to ''.");
    });

    test( "nameSpace.to.string({})", function() {
        deepEqual( nameSpace.to.string({}) === '', true, "nameSpace.to.string converts {} to string empty.");
    });

    test( "nameSpace.to.string({a: 'a', 1: '1', x: false, y: []})", function() {
        deepEqual( nameSpace.to.string({a: 'a', 1: '1', x: false, y: []}) === '', true, "nameSpace.to.string converts {a: 'a', 1: '1', x: false, y: []} to string empty.");
    });

    test( "nameSpace.to.string({}, 'a')", function() {
        deepEqual( nameSpace.to.string({}, 'a') === 'a', true, "nameSpace.to.string converts {} to 'a'.");
    });

    test( "nameSpace.to.string([])", function() {
        deepEqual( nameSpace.to.string([]) === '', true, "nameSpace.to.string converts [] to string empty.");
    });

    test( "nameSpace.to.string([1, '1', false, {}, []])", function() {
        deepEqual( nameSpace.to.string([1, '1', false, {}, []]) === '', true, "nameSpace.to.string converts [1, '1', false, {}, []] to string empty.");
    });

    test( "nameSpace.to.string([], 'a')", function() {
        deepEqual( nameSpace.to.string([], 'a') === 'a', true, "nameSpace.to.string converts [] to 'a'.");
    });

    test( "nameSpace.to.string(1, 'a')", function() {
        deepEqual( nameSpace.to.string(1, 'a') === '1', true, "nameSpace.to.string converts 1 to '1'.");
    });

    test( "nameSpace.to.string(0, 'a')", function() {
        deepEqual( nameSpace.to.string(0, 'a') === '0', true, "nameSpace.to.string converts 0 to '0'.");
    });

    test( "nameSpace.to.string(true, 'a')", function() {
        deepEqual( nameSpace.to.string(true, 'a') === 'true', true, "nameSpace.to.string converts true to 'true'.");
    });

    test( "nameSpace.to.string(false, 'a')", function() {
        deepEqual( nameSpace.to.string(false, 'a') === 'false', true, "nameSpace.to.string converts false to 'false'.");
    });


    //#endregion nameSpace.is.string

}());

// Boolean conversion checks
(function _isBool() {

    //#region nameSpace.to.bool

    module("nameSpace.to.bool");

    test( "nameSpace.to.bool(null)", function() {
        deepEqual( nameSpace.to.bool(null), false, "nameSpace.to.bool converts null to false.");
    });

    test( "nameSpace.to.bool(undefined)", function() {
        deepEqual( nameSpace.to.bool(undefined), false, "nameSpace.to.bool converts undefined to false.");
    });

    test( "nameSpace.to.bool(NaN)", function() {
        deepEqual( nameSpace.to.bool(NaN), false, "nameSpace.to.bool converts NaN to false.");
    });

    test( "nameSpace.to.bool(Infinity)", function() {
        deepEqual( nameSpace.to.bool(Infinity), false, "nameSpace.to.bool converts Infinity to false.");
    });

    test( "nameSpace.to.bool(-Infinity)", function() {
        deepEqual( nameSpace.to.bool(-Infinity), false, "nameSpace.to.bool converts -Infinity to false.");
    });

    test( "nameSpace.to.bool({})", function() {
        deepEqual( nameSpace.to.bool({}), false, "nameSpace.to.bool converts {} to false.");
    });

    test( "nameSpace.to.bool([])", function() {
        deepEqual( nameSpace.to.bool([]), false, "nameSpace.to.bool converts [] to false.");
    });

    test( "nameSpace.to.bool(new Date())", function() {
        deepEqual( nameSpace.to.bool(new Date()), false, "nameSpace.to.bool converts new Date() to false.");
    });

    test( "nameSpace.to.bool(5)", function() {
        deepEqual( nameSpace.to.bool(5), false, "nameSpace.to.bool converts 5 to false.");
    });

    test( "nameSpace.to.bool(0)", function() {
        deepEqual( nameSpace.to.bool(0), false, "nameSpace.to.bool converts 0 to false.");
    });

    test( "nameSpace.to.bool('0')", function() {
        deepEqual( nameSpace.to.bool('0'), false, "nameSpace.to.bool converts '0' to false.");
    });

    test( "nameSpace.to.bool('false')", function() {
        deepEqual( nameSpace.to.bool('false'), false, "nameSpace.to.bool converts 'false' to false.");
    });

    test( "nameSpace.to.bool(false)", function() {
        deepEqual( nameSpace.to.bool(false), false, "nameSpace.to.bool converts false to false.");
    });

    test( "nameSpace.to.bool(1)", function() {
        deepEqual( nameSpace.to.bool(1), true, "nameSpace.to.bool converts 1 to true.");
    });

    test( "nameSpace.to.bool('1')", function() {
        deepEqual( nameSpace.to.bool('1'), true, "nameSpace.to.bool converts '1' to true.");
    });

    test( "nameSpace.to.bool('true')", function() {
        deepEqual( nameSpace.to.bool('true'), true, "nameSpace.to.bool converts 'true' to true.");
    });

    test( "nameSpace.to.bool(true)", function() {
        deepEqual( nameSpace.to.bool(true), true, "nameSpace.to.bool converts true to true.");
    });

    //#endregion nameSpace.to.bool

}());

// Number conversion checks
(function _isNumber() {

    //#region nameSpace.to.number

    module("nameSpace.to.number");

    test( "nameSpace.to.number(null)", function() {
        deepEqual( nameSpace.number.isNaN(nameSpace.to.number(null)), true, "nameSpace.to.number converts null to NaN.");
    });

    test( "nameSpace.to.number(undefined)", function() {
        deepEqual( nameSpace.number.isNaN(nameSpace.to.number(undefined)), true, "nameSpace.to.number converts undefined to NaN.");
    });

    test( "nameSpace.to.number(NaN)", function() {
        deepEqual( nameSpace.number.isNaN(nameSpace.to.number(NaN)), true, "nameSpace.to.number converts NaN to NaN.");
    });

    test( "nameSpace.to.number(Infinity)", function() {
        deepEqual( nameSpace.number.isNaN(nameSpace.to.number(Infinity)), true, "nameSpace.to.number converts Infinity to NaN.");
    });

    test( "nameSpace.to.number(-Infinity)", function() {
        deepEqual( nameSpace.number.isNaN(nameSpace.to.number(-Infinity)), true, "nameSpace.to.number converts -Infinity to NaN.");
    });

    test( "nameSpace.to.number({})", function() {
        deepEqual( nameSpace.number.isNaN(nameSpace.to.number({})), true, "nameSpace.to.number converts {} to NaN.");
    });

    test( "nameSpace.to.number([])", function() {
        deepEqual( nameSpace.number.isNaN(nameSpace.to.number([])), true, "nameSpace.to.number converts [] to NaN.");
    });

    test( "nameSpace.to.number(new Date())", function() {
        deepEqual( nameSpace.number.isNaN(nameSpace.to.number(new Date())), true, "nameSpace.to.number converts new Date() to NaN.");
    });

    test( "nameSpace.to.number(0)", function() {
        deepEqual( nameSpace.to.number(0) === 0, true, "nameSpace.to.number converts 0 to 0.");
    });

    test( "nameSpace.to.number('0')", function() {
        deepEqual( nameSpace.to.number('0') === 0, true, "nameSpace.to.number converts '0' to 0.");
    });

    test( "nameSpace.to.number('false')", function() {
        deepEqual( nameSpace.to.number('false') === 0, true, "nameSpace.to.number converts 'false' to 0.");
    });

    test( "nameSpace.to.number(false)", function() {
        deepEqual( nameSpace.to.number(false) === 0, true, "nameSpace.to.number converts false to 0.");
    });

    test( "nameSpace.to.number(1)", function() {
        deepEqual( nameSpace.to.number(1) === 1, true, "nameSpace.to.number converts 1 to 1.");
    });

    test( "nameSpace.to.number('1')", function() {
        deepEqual( nameSpace.to.number('1') === 1, true, "nameSpace.to.number converts '1' to 1.");
    });

    test( "nameSpace.to.number('true')", function() {
        deepEqual( nameSpace.to.number('true') === 1, true, "nameSpace.to.number converts 'true' to 1.");
    });

    test( "nameSpace.to.number(true)", function() {
        deepEqual( nameSpace.to.number(true) === 1, true, "nameSpace.to.bool converts true to 1.");
    });

    test( "nameSpace.to.number('42')", function() {
        deepEqual( nameSpace.to.number('42') === 42, true, "nameSpace.to.number converts '42' to 42.");
    });

    test( "nameSpace.to.number('-42')", function() {
        deepEqual( nameSpace.to.number('-42') === -42, true, "nameSpace.to.number converts '-42' to -42.");
    });



    //#endregion nameSpace.is.number

}(window.$nameSpace$));

