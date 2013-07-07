/*global n$:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

// It's desirable that these tests not be optimized for pure functional programming,
// because they need to quickly communicate their intention to the reader.
// Unless testing abstraction and encapsulation, it is better to be dundant and verbose,
// as this will make troubleshooting failures easier for anyone who might come behind

// String conversion checks
(function _toString(n$) {

    //#region n$.is.string
    module(n$.name + ".to.string");
    test( n$.name + ".to.string(null)", function() {
        deepEqual( n$.to.string(null) === '', true, n$.name + ".to.string converts null to string empty.");
    });

    test( n$.name + ".to.string(null, 'a')", function() {
        deepEqual( n$.to.string(null, 'a') === 'a', true, n$.name + ".to.string converts null to 'a'.");
    });

    test( n$.name + ".to.string(undefined)", function() {
        deepEqual( n$.to.string(undefined) === '', true, n$.name + ".to.string converts undefined to string empty.");
    });

    test( n$.name + ".to.string(undefined, 'a')", function() {
        deepEqual( n$.to.string(undefined, 'a') === 'a', true, n$.name + ".to.string converts undefined to 'a'.");
    });

    test( n$.name + ".to.string(NaN)", function() {
        deepEqual( n$.to.string(NaN) === '', true, n$.name + ".to.string converts NaN to ''.");
    });

    test( n$.name + ".to.string(Infinity)", function() {
        deepEqual( n$.to.string(Infinity) === '', true, n$.name + ".to.string converts Infinity to ''.");
    });

    test( n$.name + ".to.string({})", function() {
        deepEqual( n$.to.string({}) === '', true, n$.name + ".to.string converts {} to string empty.");
    });

    test( n$.name + ".to.string({a: 'a', 1: '1', x: false, y: []})", function() {
        deepEqual( n$.to.string({a: 'a', 1: '1', x: false, y: []}) === '', true, n$.name + ".to.string converts {a: 'a', 1: '1', x: false, y: []} to string empty.");
    });

    test( n$.name + ".to.string({}, 'a')", function() {
        deepEqual( n$.to.string({}, 'a') === 'a', true, n$.name + ".to.string converts {} to 'a'.");
    });

    test( n$.name + ".to.string([])", function() {
        deepEqual( n$.to.string([]) === '', true, n$.name + ".to.string converts [] to string empty.");
    });

    test( n$.name + ".to.string([1, '1', false, {}, []])", function() {
        deepEqual( n$.to.string([1, '1', false, {}, []]) === '', true, n$.name + ".to.string converts [1, '1', false, {}, []] to string empty.");
    });

    test( n$.name + ".to.string([], 'a')", function() {
        deepEqual( n$.to.string([], 'a') === 'a', true, n$.name + ".to.string converts [] to 'a'.");
    });

    test( n$.name + ".to.string(1, 'a')", function() {
        deepEqual( n$.to.string(1, 'a') === '1', true, n$.name + ".to.string converts 1 to '1'.");
    });

    test( n$.name + ".to.string(0, 'a')", function() {
        deepEqual( n$.to.string(0, 'a') === '0', true, n$.name + ".to.string converts 0 to '0'.");
    });

    test( n$.name + ".to.string(true, 'a')", function() {
        deepEqual( n$.to.string(true, 'a') === 'true', true, n$.name + ".to.string converts true to 'true'.");
    });

    test( n$.name + ".to.string(false, 'a')", function() {
        deepEqual( n$.to.string(false, 'a') === 'false', true, n$.name + ".to.string converts false to 'false'.");
    });


    //#endregion n$.is.string

}(window.$nameSpace$));

// Boolean conversion checks
(function _isBool(n$) {

    //#region n$.to.bool

    module(n$.name + ".to.bool");

    test( n$.name + ".to.bool(null)", function() {
        deepEqual( n$.to.bool(null), false, n$.name + ".to.bool converts null to false.");
    });

    test( n$.name + ".to.bool(undefined)", function() {
        deepEqual( n$.to.bool(undefined), false, n$.name + ".to.bool converts undefined to false.");
    });

    test( n$.name + ".to.bool(NaN)", function() {
        deepEqual( n$.to.bool(NaN), false, n$.name + ".to.bool converts NaN to false.");
    });

    test( n$.name + ".to.bool(Infinity)", function() {
        deepEqual( n$.to.bool(Infinity), false, n$.name + ".to.bool converts Infinity to false.");
    });

    test( n$.name + ".to.bool(-Infinity)", function() {
        deepEqual( n$.to.bool(-Infinity), false, n$.name + ".to.bool converts -Infinity to false.");
    });

    test( n$.name + ".to.bool({})", function() {
        deepEqual( n$.to.bool({}), false, n$.name + ".to.bool converts {} to false.");
    });

    test( n$.name + ".to.bool([])", function() {
        deepEqual( n$.to.bool([]), false, n$.name + ".to.bool converts [] to false.");
    });

    test( n$.name + ".to.bool(new Date())", function() {
        deepEqual( n$.to.bool(new Date()), false, n$.name + ".to.bool converts new Date() to false.");
    });

    test( n$.name + ".to.bool(5)", function() {
        deepEqual( n$.to.bool(5), false, n$.name + ".to.bool converts 5 to false.");
    });

    test( n$.name + ".to.bool(0)", function() {
        deepEqual( n$.to.bool(0), false, n$.name + ".to.bool converts 0 to false.");
    });

    test( n$.name + ".to.bool('0')", function() {
        deepEqual( n$.to.bool('0'), false, n$.name + ".to.bool converts '0' to false.");
    });

    test( n$.name + ".to.bool('false')", function() {
        deepEqual( n$.to.bool('false'), false, n$.name + ".to.bool converts 'false' to false.");
    });

    test( n$.name + ".to.bool(false)", function() {
        deepEqual( n$.to.bool(false), false, n$.name + ".to.bool converts false to false.");
    });

    test( n$.name + ".to.bool(1)", function() {
        deepEqual( n$.to.bool(1), true, n$.name + ".to.bool converts 1 to true.");
    });

    test( n$.name + ".to.bool('1')", function() {
        deepEqual( n$.to.bool('1'), true, n$.name + ".to.bool converts '1' to true.");
    });

    test( n$.name + ".to.bool('true')", function() {
        deepEqual( n$.to.bool('true'), true, n$.name + ".to.bool converts 'true' to true.");
    });

    test( n$.name + ".to.bool(true)", function() {
        deepEqual( n$.to.bool(true), true, n$.name + ".to.bool converts true to true.");
    });

    //#endregion n$.to.bool

}(window.$nameSpace$));

// Number conversion checks
(function _isNumber(n$) {

    //#region n$.to.number

    module(n$.name + ".to.number");

    test( n$.name + ".to.number(null)", function() {
        deepEqual( n$.number.isNaN(n$.to.number(null)), true, n$.name + ".to.number converts null to NaN.");
    });

    test( n$.name + ".to.number(undefined)", function() {
        deepEqual( n$.number.isNaN(n$.to.number(undefined)), true, n$.name + ".to.number converts undefined to NaN.");
    });

    test( n$.name + ".to.number(NaN)", function() {
        deepEqual( n$.number.isNaN(n$.to.number(NaN)), true, n$.name + ".to.number converts NaN to NaN.");
    });

    test( n$.name + ".to.number(Infinity)", function() {
        deepEqual( n$.number.isNaN(n$.to.number(Infinity)), true, n$.name + ".to.number converts Infinity to NaN.");
    });

    test( n$.name + ".to.number(-Infinity)", function() {
        deepEqual( n$.number.isNaN(n$.to.number(-Infinity)), true, n$.name + ".to.number converts -Infinity to NaN.");
    });

    test( n$.name + ".to.number({})", function() {
        deepEqual( n$.number.isNaN(n$.to.number({})), true, n$.name + ".to.number converts {} to NaN.");
    });

    test( n$.name + ".to.number([])", function() {
        deepEqual( n$.number.isNaN(n$.to.number([])), true, n$.name + ".to.number converts [] to NaN.");
    });

    test( n$.name + ".to.number(new Date())", function() {
        deepEqual( n$.number.isNaN(n$.to.number(new Date())), true, n$.name + ".to.number converts new Date() to NaN.");
    });

    test( n$.name + ".to.number(0)", function() {
        deepEqual( n$.to.number(0) === 0, true, n$.name + ".to.number converts 0 to 0.");
    });

    test( n$.name + ".to.number('0')", function() {
        deepEqual( n$.to.number('0') === 0, true, n$.name + ".to.number converts '0' to 0.");
    });

    test( n$.name + ".to.number('false')", function() {
        deepEqual( n$.to.number('false') === 0, true, n$.name + ".to.number converts 'false' to 0.");
    });

    test( n$.name + ".to.number(false)", function() {
        deepEqual( n$.to.number(false) === 0, true, n$.name + ".to.number converts false to 0.");
    });

    test( n$.name + ".to.number(1)", function() {
        deepEqual( n$.to.number(1) === 1, true, n$.name + ".to.number converts 1 to 1.");
    });

    test( n$.name + ".to.number('1')", function() {
        deepEqual( n$.to.number('1') === 1, true, n$.name + ".to.number converts '1' to 1.");
    });

    test( n$.name + ".to.number('true')", function() {
        deepEqual( n$.to.number('true') === 1, true, n$.name + ".to.number converts 'true' to 1.");
    });

    test( n$.name + ".to.number(true)", function() {
        deepEqual( n$.to.number(true) === 1, true, n$.name + ".to.bool converts true to 1.");
    });

    test( n$.name + ".to.number('42')", function() {
        deepEqual( n$.to.number('42') === 42, true, n$.name + ".to.number converts '42' to 42.");
    });

    test( n$.name + ".to.number('-42')", function() {
        deepEqual( n$.to.number('-42') === -42, true, n$.name + ".to.number converts '-42' to -42.");
    });



    //#endregion n$.is.number

}(window.$nameSpace$));

