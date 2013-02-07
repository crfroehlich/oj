/*global OJ:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

// It's desirable that these tests not be optimized for pure functional programming,
// because they need to quickly communicate their intention to the reader.
// Unless testing abstraction and encapsulation, it is better to be dundant and verbose,
// as this will make troubleshooting failures easier for anyone who might come behind

// String conversion checks
(function _toString() {

	//#region OJ.is.string
	module("Oj.to.string");
	test( "OJ.to.string(null)", function() {
        deepEqual( OJ.to.string(null) === '', true, "OJ.to.string converts null to string empty.");
	});

    test( "OJ.to.string(null, 'a')", function() {
        deepEqual( OJ.to.string(null, 'a') === 'a', true, "OJ.to.string converts null to 'a'.");
	});

	test( "OJ.to.string(undefined)", function() {
        deepEqual( OJ.to.string(undefined) === '', true, "OJ.to.string converts undefined to string empty.");
	});

	test( "OJ.to.string(undefined, 'a')", function() {
        deepEqual( OJ.to.string(undefined, 'a') === 'a', true, "OJ.to.string converts undefined to 'a'.");
	});

	test( "OJ.to.string(NaN)", function() {
        deepEqual( OJ.to.string(NaN) === '', true, "OJ.to.string converts NaN to ''.");
	});

	test( "OJ.to.string(Infinity)", function() {
        deepEqual( OJ.to.string(Infinity) === '', true, "OJ.to.string converts Infinity to ''.");
	});

	test( "OJ.to.string({})", function() {
        deepEqual( OJ.to.string({}) === '', true, "OJ.to.string converts {} to string empty.");
	});

	test( "OJ.to.string({a: 'a', 1: '1', x: false, y: []})", function() {
        deepEqual( OJ.to.string({a: 'a', 1: '1', x: false, y: []}) === '', true, "OJ.to.string converts {a: 'a', 1: '1', x: false, y: []} to string empty.");
	});

	test( "OJ.to.string({}, 'a')", function() {
        deepEqual( OJ.to.string({}, 'a') === 'a', true, "OJ.to.string converts {} to 'a'.");
	});

	test( "OJ.to.string([])", function() {
        deepEqual( OJ.to.string([]) === '', true, "OJ.to.string converts [] to string empty.");
	});

	test( "OJ.to.string([1, '1', false, {}, []])", function() {
        deepEqual( OJ.to.string([1, '1', false, {}, []]) === '', true, "OJ.to.string converts [1, '1', false, {}, []] to string empty.");
	});

	test( "OJ.to.string([], 'a')", function() {
        deepEqual( OJ.to.string([], 'a') === 'a', true, "OJ.to.string converts [] to 'a'.");
	});

	test( "OJ.to.string(1, 'a')", function() {
        deepEqual( OJ.to.string(1, 'a') === '1', true, "OJ.to.string converts 1 to '1'.");
	});

	test( "OJ.to.string(0, 'a')", function() {
        deepEqual( OJ.to.string(0, 'a') === '0', true, "OJ.to.string converts 0 to '0'.");
	});

	test( "OJ.to.string(true, 'a')", function() {
        deepEqual( OJ.to.string(true, 'a') === 'true', true, "OJ.to.string converts true to 'true'.");
	});

	test( "OJ.to.string(false, 'a')", function() {
        deepEqual( OJ.to.string(false, 'a') === 'false', true, "OJ.to.string converts false to 'false'.");
	});


	//#endregion OJ.is.string

}());

// Boolean conversion checks
(function _isBool() {

	//#region OJ.to.bool

	module("OJ.to.bool");

	test( "OJ.to.bool(null)", function() {
        deepEqual( OJ.to.bool(null), false, "OJ.to.bool converts null to false.");
	});

	test( "OJ.to.bool(undefined)", function() {
        deepEqual( OJ.to.bool(undefined), false, "OJ.to.bool converts undefined to false.");
	});

	test( "OJ.to.bool(NaN)", function() {
        deepEqual( OJ.to.bool(NaN), false, "OJ.to.bool converts NaN to false.");
	});

	test( "OJ.to.bool(Infinity)", function() {
        deepEqual( OJ.to.bool(Infinity), false, "OJ.to.bool converts Infinity to false.");
	});

	test( "OJ.to.bool(-Infinity)", function() {
        deepEqual( OJ.to.bool(-Infinity), false, "OJ.to.bool converts -Infinity to false.");
	});

	test( "OJ.to.bool({})", function() {
        deepEqual( OJ.to.bool({}), false, "OJ.to.bool converts {} to false.");
	});

	test( "OJ.to.bool([])", function() {
        deepEqual( OJ.to.bool([]), false, "OJ.to.bool converts [] to false.");
	});

	test( "OJ.to.bool(new Date())", function() {
        deepEqual( OJ.to.bool(new Date()), false, "OJ.to.bool converts new Date() to false.");
	});

	test( "OJ.to.bool(5)", function() {
        deepEqual( OJ.to.bool(5), false, "OJ.to.bool converts 5 to false.");
	});

	test( "OJ.to.bool(0)", function() {
        deepEqual( OJ.to.bool(0), false, "OJ.to.bool converts 0 to false.");
	});

	test( "OJ.to.bool('0')", function() {
        deepEqual( OJ.to.bool('0'), false, "OJ.to.bool converts '0' to false.");
	});

	test( "OJ.to.bool('false')", function() {
        deepEqual( OJ.to.bool('false'), false, "OJ.to.bool converts 'false' to false.");
	});

	test( "OJ.to.bool(false)", function() {
        deepEqual( OJ.to.bool(false), false, "OJ.to.bool converts false to false.");
	});

	test( "OJ.to.bool(1)", function() {
        deepEqual( OJ.to.bool(1), true, "OJ.to.bool converts 1 to true.");
	});

	test( "OJ.to.bool('1')", function() {
        deepEqual( OJ.to.bool('1'), true, "OJ.to.bool converts '1' to true.");
	});

	test( "OJ.to.bool('true')", function() {
        deepEqual( OJ.to.bool('true'), true, "OJ.to.bool converts 'true' to true.");
	});

	test( "OJ.to.bool(true)", function() {
        deepEqual( OJ.to.bool(true), true, "OJ.to.bool converts true to true.");
	});

	//#endregion OJ.to.bool

}());

// Number conversion checks
(function _isNumber() {

	//#region OJ.to.number

	module("OJ.to.number");

	test( "OJ.to.number(null)", function() {
        deepEqual( OJ.number.isNaN(OJ.to.number(null)), true, "OJ.to.number converts null to NaN.");
	});

	test( "OJ.to.number(undefined)", function() {
        deepEqual( OJ.number.isNaN(OJ.to.number(undefined)), true, "OJ.to.number converts undefined to NaN.");
	});

	test( "OJ.to.number(NaN)", function() {
        deepEqual( OJ.number.isNaN(OJ.to.number(NaN)), true, "OJ.to.number converts NaN to NaN.");
	});

	test( "OJ.to.number(Infinity)", function() {
        deepEqual( OJ.number.isNaN(OJ.to.number(Infinity)), true, "OJ.to.number converts Infinity to NaN.");
	});

	test( "OJ.to.number(-Infinity)", function() {
        deepEqual( OJ.number.isNaN(OJ.to.number(-Infinity)), true, "OJ.to.number converts -Infinity to NaN.");
	});

	test( "OJ.to.number({})", function() {
        deepEqual( OJ.number.isNaN(OJ.to.number({})), true, "OJ.to.number converts {} to NaN.");
	});

	test( "OJ.to.number([])", function() {
        deepEqual( OJ.number.isNaN(OJ.to.number([])), true, "OJ.to.number converts [] to NaN.");
	});

	test( "OJ.to.number(new Date())", function() {
        deepEqual( OJ.number.isNaN(OJ.to.number(new Date())), true, "OJ.to.number converts new Date() to NaN.");
	});

	test( "OJ.to.number(0)", function() {
        deepEqual( OJ.to.number(0) === 0, true, "OJ.to.number converts 0 to 0.");
	});

	test( "OJ.to.number('0')", function() {
        deepEqual( OJ.to.number('0') === 0, true, "OJ.to.number converts '0' to 0.");
	});

	test( "OJ.to.number('false')", function() {
        deepEqual( OJ.to.number('false') === 0, true, "OJ.to.number converts 'false' to 0.");
	});

	test( "OJ.to.number(false)", function() {
        deepEqual( OJ.to.number(false) === 0, true, "OJ.to.number converts false to 0.");
	});

	test( "OJ.to.number(1)", function() {
        deepEqual( OJ.to.number(1) === 1, true, "OJ.to.number converts 1 to 1.");
	});

	test( "OJ.to.number('1')", function() {
        deepEqual( OJ.to.number('1') === 1, true, "OJ.to.number converts '1' to 1.");
	});

	test( "OJ.to.number('true')", function() {
        deepEqual( OJ.to.number('true') === 1, true, "OJ.to.number converts 'true' to 1.");
	});

	test( "OJ.to.number(true)", function() {
        deepEqual( OJ.to.number(true) === 1, true, "OJ.to.bool converts true to 1.");
	});

	test( "OJ.to.number('42')", function() {
        deepEqual( OJ.to.number('42') === 42, true, "OJ.to.number converts '42' to 42.");
	});

	test( "OJ.to.number('-42')", function() {
        deepEqual( OJ.to.number('-42') === -42, true, "OJ.to.number converts '-42' to -42.");
	});



	//#endregion OJ.is.number

}());

